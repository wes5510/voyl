# Code Researcher - 워크스페이스 관련 흐름 조사

## 조사 날짜
2025-12-14

## 조사 목적
root node 생성 위치를 결정하기 위해 워크스페이스 관련 흐름 조사

## 1. 새 워크스페이스 생성 흐름

### 전체 흐름
```
UI (CreateWorkspaceButton)
  → useInitializeWorkspace mutation
    → initializeApp(path)
      → window.api['app.initialize'](path)
        → IPC: 'app.initialize'
          → AppModel.initializeApp({ workspaceDirPath })
```

### 상세 분석

#### Frontend (Renderer)
- **UI**: `/apps/desktop/src/renderer/page/InitializationGuard/WorkspaceSettingDialog/CreateWorkspaceDialogContent/CreateWorkspaceButton/index.tsx`
  - 사용자가 "시작하기" 버튼 클릭
  - `useInitializeWorkspace` hook 호출

- **State Hook**: `/apps/desktop/src/renderer/state/app/hook.ts`
  ```typescript
  export function useInitializeWorkspace() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (path: string) => {
        await initializeApp(path)
        return true
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.initialization() })
      },
    })
  }
  ```

- **Repo**: `/apps/desktop/src/renderer/repo/app.ts`
  ```typescript
  export async function initializeApp(path: string): Promise<void> {
    await window.api['app.initialize'](path)
  }
  ```

#### Backend (Main)
- **IPC Handler**: `/apps/desktop/src/main/ipc/app.ts`
  ```typescript
  'app.initialize': async (workspaceDirPath: string): Promise<void> => {
    await AppModel.initializeApp({ workspaceDirPath })
  }
  ```

- **App Model**: `/apps/desktop/src/main/model/app/index.ts`
  ```typescript
  export async function initializeApp({
    workspaceDirPath,
  }: {
    workspaceDirPath: string
  }): Promise<void> {
    await SyncMetadataRepo.initialize()
    await AppRepo.initialize({
      workspaceDirPath,
      version: APP_VERSION,
    })
    await WorkspaceModel.initialize({ workspaceDirPath })
    await TreeModel.initialize({ workspaceDirPath })  // ← root 생성
  }
  ```

### 핵심 발견
**`initializeApp`은 "새 워크스페이스 생성" 전용 함수**
- 주석: "앱 초기화 (첫 실행 - 설정 생성만)"
- UI 상 "워크스페이스 생성" 다이얼로그에서만 호출됨
- `isInitialized()` 체크 후 false일 때만 `InitializationGuard`가 생성 다이얼로그 표시

## 2. initializeApp vs 새 워크스페이스

### initializeApp의 정체
**명칭과 실제 용도 불일치**
- **함수명**: `initializeApp` (앱 초기화처럼 보임)
- **주석**: "앱 초기화 (첫 실행 - 설정 생성만)"
- **실제**: 새 워크스페이스 생성 함수
- **UI**: "워크스페이스 생성" 다이얼로그에서 호출

### isInitialized 체크 로직
```typescript
// AppRepo.exists() 체크
export async function isInitialized(): Promise<boolean> {
  const exists = await AppRepo.exists()
  return exists
}
```

**앱이 초기화되지 않은 경우**:
1. `isInitialized()` → false
2. `InitializationGuard`가 `WorkspaceSettingDialog` 표시
3. 사용자가 경로 선택 → "워크스페이스 생성"
4. `initializeApp` 호출 → root 생성

**앱이 이미 초기화된 경우**:
1. `isInitialized()` → true
2. `InitializationGuard`가 children 렌더링
3. `SyncGuard`가 `sync()` 호출

### 구분 정리
| 상황 | 호출 함수 | root 생성 여부 | 비고 |
|------|----------|---------------|------|
| 새 워크스페이스 | `initializeApp` | ✓ 생성 | 적절 |
| 기존 워크스페이스 | `sync` | ✗ (현재 버그) | 기존 root 로드해야 함 |

## 3. 동기화(sync) 흐름

### 전체 흐름
```
SyncGuard (최초 렌더링)
  → useSyncApp mutation
    → syncApp()
      → window.api['app.sync']()
        → AppModel.sync()
          → WorkspaceModel.sync({ workspaceDirPath })
          → NodeModel.sync({ workspaceDirPath })
```

### 상세 분석

#### Frontend (Renderer)
- **SyncGuard**: `/apps/desktop/src/renderer/page/SyncGuard/index.tsx`
  ```typescript
  export default function SyncGuard({ children }: SyncGuardProps) {
    const { mutate, isPending } = useSyncApp()

    useEffect(() => {
      mutate()
    }, [mutate])

    return isPending ? <SyncSplash /> : <>{children}</>
  }
  ```
  - `InitializationGuard` 통과 후 최초 렌더링 시 `sync()` 호출
  - 동기화 중에는 `SyncSplash` 표시

#### Backend (Main)
- **App Model**: `/apps/desktop/src/main/model/app/index.ts`
  ```typescript
  export async function sync(): Promise<void> {
    await AppRepo.sync()

    const workspaceDirPath = await AppRepo.getWorkspaceDirPath()
    if (!workspaceDirPath) {
      throw new Error('Workspace directory path not found')
    }

    await WorkspaceModel.sync({ workspaceDirPath })
    await NodeModel.sync({ workspaceDirPath })
  }
  ```

- **Node Sync**: `/apps/desktop/src/main/repo/node/index.ts`
  ```typescript
  export async function sync(): Promise<void> {
    const ids = await NodeFs.getIds()  // 파일시스템에서 모든 노드 ID 조회
    await syncNodes({ ids })
  }

  async function syncNodes({ ids }: { ids: string[] }) {
    return await Promise.all(
      ids.map(async (id: string) => {
        return await syncSingle({ id })
      }),
    )
  }
  ```

### 핵심 발견
**sync는 파일시스템 → DB 동기화**
- 파일시스템에 있는 모든 노드를 DB에 동기화
- root 노드도 파일시스템에 있으면 자동으로 DB에 로드됨
- **root 생성 로직 없음** (파일시스템에 있다고 가정)

## 4. root node 필요 시점

### root 참조 위치 추적

#### 1. 트리 조회 시
- **IPC Handler**: `/apps/desktop/src/main/ipc/tree.ts`
  ```typescript
  'tree.getRootNodeId': (): string => {
    return TreeModel.getRootNodeId()
  }
  ```

- **Tree Model**: `/apps/desktop/src/main/model/tree/index.ts`
  ```typescript
  export function getRootNodeId() {
    return ROOT_NODE.id
  }
  ```

- **ROOT_NODE 상수**: `/apps/desktop/src/main/model/tree/const.ts`
  ```typescript
  export const ROOT_NODE = {
    id: 'root',
    parentId: null,
    childIds: [],
    title: 'Root',
    content: '',
  }
  ```

#### 2. Frontend에서 사용
- **Query**: `/apps/desktop/src/renderer/state/tree/queryOption.ts`
  ```typescript
  export const getRootNodeIdQueryOptions = () => ({
    queryKey: QUERY_KEYS.rootNodeId(),
    queryFn: fetchRootNodeId,  // → 'tree.getRootNodeId' 호출
  })
  ```

### 핵심 발견
**root ID는 하드코딩된 상수**
- `getRootNodeId()`는 단순히 `'root'` 문자열 반환
- 실제 root 노드 데이터는 DB/파일시스템에서 조회
- **root 노드가 없으면 조회 실패**

### root 노드 필요 상황
1. **트리 렌더링**: UI에서 트리 구조를 표시하려면 root 필요
2. **노드 추가**: 새 노드의 parentId로 root 지정 가능
3. **트리 탐색**: root에서 시작해서 하위 노드 탐색

## 5. 다층 분석: 버그 발생 메커니즘

### 설정 레이어
- **App 설정**: `/apps/desktop/src/main/repo/app/fs/index.ts`
  - `exists()` 체크로 초기화 여부 판단
  - 설정 파일 존재 → `isInitialized() === true`

### 코드 레이어
- **TreeModel.initialize**: `/apps/desktop/src/main/model/tree/index.ts`
  ```typescript
  export async function initialize({
    workspaceDirPath,
  }: {
    workspaceDirPath: string
  }): Promise<void> {
    await NodeModel.initialize({ workspaceDirPath })
    await NodeModel.addNode(ROOT_NODE)  // ← 무조건 생성
  }
  ```

### 의존성 레이어
- **NodeRepo.addNode**: `/apps/desktop/src/main/repo/node/index.ts`
  ```typescript
  export async function addNode(node: NewNode): Promise<Node> {
    const id = node.id ?? uuidv4()
    const fullNode: Node = {
      id,
      parentId: node.parentId ?? null,
      childIds: node.childIds ?? [],
      title: node.title ?? '',
      content: node.content ?? '',
    }
    await NodeFs.write({ id, data: fullNode })  // ← 파일 덮어쓰기
    await syncSingle({ id })                    // ← DB 동기화

    return fullNode
  }
  ```

### 버그 발생 시나리오

#### Case 1: 새 워크스페이스 (정상)
```
1. isInitialized() → false
2. WorkspaceSettingDialog 표시
3. 사용자가 경로 선택 → initializeApp 호출
4. TreeModel.initialize → addNode(ROOT_NODE)
5. root.json 생성 ✓
```

#### Case 2: 기존 워크스페이스 (버그 - 가정된 시나리오)
```
1. isInitialized() → false (설정 파일 없음)
2. WorkspaceSettingDialog 표시
3. 사용자가 **기존 워크스페이스 경로** 선택
4. initializeApp 호출
5. TreeModel.initialize → addNode(ROOT_NODE)
6. 기존 root.json 덮어쓰기 ✗
```

**하지만 실제로는...**
현재 UI는 "새 워크스페이스 생성"만 지원하고, "기존 워크스페이스 열기" 기능이 없음.

### 실제 버그 발생 조건 추론

**Case A: 설정 파일만 삭제된 경우**
```
1. 사용자가 앱 설정 파일을 실수로 삭제 (or 마이그레이션)
2. 워크스페이스 데이터(root.json 등)는 그대로 존재
3. isInitialized() → false
4. 사용자가 기존 워크스페이스 경로를 다시 선택
5. initializeApp → root 덮어쓰기 ✗
```

**Case B: 여러 워크스페이스 전환**
```
1. 워크스페이스 A에서 작업 중
2. 워크스페이스 B로 전환 시도
3. 현재는 전환 UI가 없어서 initializeApp으로 전환?
4. root 덮어쓰기 ✗
```

## 결론

### 주요 발견사항

1. **initializeApp은 새 워크스페이스 생성 전용**
   - 명칭과 달리 실제로는 "새 워크스페이스 생성" 함수
   - `TreeModel.initialize`에서 무조건 root 생성
   - 기존 워크스페이스에 사용하면 root 덮어씀

2. **sync는 파일시스템 → DB 동기화만 수행**
   - root 생성 로직 없음
   - 파일시스템에 root가 있다고 가정

3. **root node는 하드코딩된 ID ('root')**
   - 조회 시 DB/파일시스템에서 id='root'인 노드 검색
   - 없으면 조회 실패

4. **현재 UI는 "기존 워크스페이스 열기" 미지원**
   - `WorkspaceSettingDialog`는 "생성"만 가능
   - "열기" 기능이 없어 버그 재현 조건 불명확

### Needs User Decision

#### 결정 1: 버그 재현 시나리오 확인
**질문**: 실제로 어떤 상황에서 기존 워크스페이스의 root가 덮어씌워졌나요?

**옵션**:
1. 설정 파일만 삭제된 상태에서 같은 경로를 다시 선택
2. 워크스페이스 전환 기능 사용 시
3. 기타 (구체적인 상황 설명 필요)

**중요성**: 정확한 시나리오를 알아야 적절한 해결책 선택 가능

#### 결정 2: root 생성 위치
**옵션**:

**A. TreeModel.initialize에서 조건부 생성 (현재 제안)**
```typescript
export async function initialize({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  await NodeModel.initialize({ workspaceDirPath })

  const exists = await NodeModel.isExist({ id: ROOT_NODE.id })
  if (!exists) {
    await NodeModel.addNode(ROOT_NODE)
  }
}
```
- 장점: 초기화 시 root 보장
- 단점: sync 전이라 파일시스템 확인 불가 (여전히 버그)

**B. sync 후 조건부 생성**
```typescript
export async function sync(): Promise<void> {
  await AppRepo.sync()
  await WorkspaceModel.sync({ workspaceDirPath })
  await NodeModel.sync({ workspaceDirPath })

  // sync 완료 후 root 확인
  const rootExists = await NodeModel.isExist({ id: ROOT_NODE.id })
  if (!rootExists) {
    await NodeModel.addNode(ROOT_NODE)
  }
}
```
- 장점: sync 후라 정확한 확인 가능
- 단점: root가 항상 필요한지 확인 필요

**C. TreeModel.initialize에서 무조건 제거 + 별도 함수**
```typescript
// TreeModel.initialize: root 생성 제거
export async function initialize({ workspaceDirPath }) {
  await NodeModel.initialize({ workspaceDirPath })
}

// 새 함수: 새 워크스페이스 생성 전용
export async function createNewWorkspace({ workspaceDirPath }) {
  await initialize({ workspaceDirPath })
  await NodeModel.addNode(ROOT_NODE)
}
```
- 장점: 명확한 책임 분리
- 단점: AppModel.initializeApp 수정 필요

**권장**: **옵션 B (sync 후 조건부 생성)**
- 이유:
  1. sync 후라 파일시스템/DB 모두 정확히 확인 가능
  2. 기존 root 보존 보장
  3. 새 워크스페이스는 root 자동 생성
  4. 기존 코드 최소 변경

#### 결정 3: "기존 워크스페이스 열기" 기능
**질문**: "기존 워크스페이스 열기" 기능이 필요한가요?

**배경**:
- 현재는 "생성"만 가능
- 여러 워크스페이스 전환 기능 없음

**영향**:
- 필요하다면: 별도 UI + `openExistingWorkspace` 함수 구현
- 불필요하다면: 현재 그대로 유지

## 다음 단계 제안

1. **사용자 결정 필요**: 위 3가지 결정사항 확인
2. **해결 방향**:
   - 옵션 B 채택 시: `AppModel.sync`에 root 체크/생성 로직 추가
   - 옵션 C 채택 시: `TreeModel.createNewWorkspace` 추가 + `initializeApp` 수정
3. **테스트**:
   - 새 워크스페이스: root 생성 확인
   - 기존 워크스페이스: root 보존 확인
   - sync 후: root 조회 성공 확인
