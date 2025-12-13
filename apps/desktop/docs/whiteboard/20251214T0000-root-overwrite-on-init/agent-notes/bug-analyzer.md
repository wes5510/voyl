# Bug Analyzer: Root Overwrite on Init

## 증상 요약

앱 초기화 시 선택한 워크스페이스에 기존 root node가 있어도 새로운 root node를 생성하여 기존 root를 덮어씌움.

결과:
- root node의 childIds가 빈 배열로 리셋
- title이 'Root'로 리셋
- content가 빈 문자열로 리셋
- 사용자가 구성한 트리 구조 손실

## 수집된 정보

### code-researcher

**근본 원인 위치**: `/apps/desktop/src/main/model/tree/index.ts`

```typescript
export async function initialize({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  await NodeModel.initialize({ workspaceDirPath })
  await NodeModel.addNode(ROOT_NODE)  // ← 무조건 root 생성
}
```

**호출 체인**:
```
앱 시작 → initializeApp() → TreeModel.initialize()
         → NodeModel.addNode(ROOT_NODE) → NodeRepo.addNode()
         → NodeFs.write() (fse.writeJson) → 파일 덮어쓰기
```

**ROOT_NODE 정의** (`/apps/desktop/src/main/model/tree/const.ts`):
```typescript
export const ROOT_NODE = {
  id: 'root',  // 고정 ID
  parentId: null,
  childIds: [],
  title: 'Root',
  content: '',
}
```

**NodeRepo.addNode** (`/apps/desktop/src/main/repo/node/index.ts:61-74`):
- 중복 체크 없이 무조건 파일 작성
- `NodeFs.write()` → `fse.writeJson()` → 기존 파일 덮어씀

**버그 재현 시나리오**:
1. 앱 최초 실행 (설정 파일 없음)
2. 기존 워크스페이스 경로 선택 (이미 root node 있음)
3. `initializeApp` 호출 → root node 덮어씌워짐

**워크플로우 분석**:
- **새 워크스페이스**: `initializeApp` → root 생성 (정상)
- **기존 워크스페이스**: `sync` → root 로드 (root 생성 로직 없음)
- **버그 상황**: 설정 파일 없이 기존 워크스페이스 열 때 → `initializeApp` 호출 → root 덮어씀

### 기타 리서처
(조사하지 않음 - 코드 레이어 문제로 충분히 파악됨)

## 근본 원인

### 설정 레이어
문제 없음.

### 코드 레이어
**문제**: `TreeModel.initialize`가 root node 존재 여부를 확인하지 않고 무조건 생성

**원인 체인**:
1. **1차 원인**: `TreeModel.initialize`에 root node 존재 확인 로직 부재
   - 기존 root 확인 없이 `NodeModel.addNode(ROOT_NODE)` 무조건 호출

2. **2차 원인**: 초기화 시점 문제
   - `initialize` 시점에는 DB 동기화 전이라 파일시스템 상태 확인 불가
   - `NodeModel.isExist`는 DB만 체크하므로 초기화 시점엔 항상 false

3. **3차 원인**: `initializeApp` vs `sync` 역할 혼재
   - `initializeApp`: 새 워크스페이스 생성 전용이어야 함
   - `sync`: 기존 워크스페이스 로드용
   - 하지만 "설정 없음 + 기존 경로" 상황에서 `initializeApp` 호출됨

### 의존성 레이어
문제 없음. `fse.writeJson`의 정상 동작.

## 수정 전략

### 필수 수정

#### 옵션 A: TreeModel.initialize에서 조건부 생성 (기존 제안)
```typescript
export async function initialize({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  await NodeModel.initialize({ workspaceDirPath })

  const rootExists = await NodeModel.isExist({ id: ROOT_NODE.id })
  if (!rootExists) {
    await NodeModel.addNode(ROOT_NODE)
  }
}
```

**장점**: 최소 변경, 명확한 의도
**단점**: 초기화 시점 문제 - `NodeModel.initialize`가 sync를 포함하지 않으면 여전히 버그 발생 가능

#### 옵션 B: sync 후 조건부 생성 (사용자 제안)
```typescript
// AppModel.sync()에서
export async function sync(): Promise<void> {
  await AppRepo.sync()

  const workspaceDirPath = await AppRepo.getWorkspaceDirPath()
  if (!workspaceDirPath) {
    throw new Error('Workspace directory path not found')
  }

  await WorkspaceModel.sync({ workspaceDirPath })
  await NodeModel.sync({ workspaceDirPath })

  // sync 완료 후 root 확인
  const rootExists = await NodeModel.isExist({ id: ROOT_NODE.id })
  if (!rootExists) {
    await NodeModel.addNode(ROOT_NODE)
  }
}

// TreeModel.initialize에서 root 생성 제거
export async function initialize({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  await NodeModel.initialize({ workspaceDirPath })
  // root 생성 로직 제거
}
```

**장점**:
1. sync 후라 파일시스템/DB 모두 정확히 확인 가능
2. 기존 root 보존 보장
3. 새 워크스페이스는 root 자동 생성
4. `initializeApp` vs `sync` 역할 명확히 분리

**단점**:
- `TreeModel.initialize` 변경 + `AppModel.sync` 변경 (2개 파일)
- TreeModel이 아닌 AppModel에서 root 관리 (책임 분산)

### 선택: 옵션 B (sync 후 조건부 생성)

**이유**:
1. **정확성**: sync 후 확인이므로 파일시스템/DB 상태 정확히 반영
2. **안전성**: 어떤 상황에서도 기존 root 보존 보장
3. **명확성**:
   - `initializeApp`: 새 워크스페이스 전용 (root 생성 없음)
   - `sync`: 기존 워크스페이스 로드 + root 없으면 생성
4. **일관성**: 앱 시작 시 항상 `sync`를 거치므로 root 보장

#### 수정 파일
1. `/apps/desktop/src/main/model/tree/index.ts` - `initialize`에서 root 생성 제거
2. `/apps/desktop/src/main/model/app/index.ts` - `sync`에 root 확인/생성 추가

### 수정 순서
1. `TreeModel.initialize` - root 생성 제거
2. `AppModel.sync` - root 확인/생성 추가

순서 의존성: 1→2 순서로 진행 (동시 작업 시 버그 발생 가능)

### 주의사항

- `NodeModel.isExist`는 이미 구현되어 있음
- ROOT_NODE.id는 변경하지 말 것
- sync 후에만 root 확인하므로 정확성 보장
- `initializeApp`은 새 워크스페이스만 위한 것임을 문서화

## 권장 조치

### 수정 담당

| 수정 내용 | 담당 Generator | 레이어 |
|-----------|----------------|--------|
| TreeModel.initialize 로직 수정 | be-model-generator | Backend Model |
| AppModel.sync 로직 수정 | be-model-generator | Backend Model |

### 완료 조건

다음이 모두 충족되어야 함:

1. TreeModel.initialize에서 root 생성 제거
2. AppModel.sync에서 root 존재 확인 후 생성
3. 타입체크 통과
4. 린트 통과
5. 테스트 통과

## 실행 준비 완료

근본 원인과 수정 전략이 명확함. planner 단계로 진행 가능.

**최종 선택**: sync 후 조건부 생성 방식 (옵션 B)
