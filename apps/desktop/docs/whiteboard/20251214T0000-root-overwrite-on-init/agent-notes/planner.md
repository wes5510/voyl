# Root Overwrite on Init 버그 수정 - 실행 계획

**작성일**: 2025-12-14
**작성자**: Planner Agent

## 작업 목표

앱 초기화시 기존 root node가 존재해도 무조건 새로운 root node를 생성하여 기존 데이터를 덮어쓰는 버그 수정.

### 수정 전략 (bug-analyzer 옵션 B)

sync 완료 후 root 확인/생성 방식:
1. `TreeModel.initialize`에서 root 생성 제거 (동기화 전이라 정확한 확인 불가)
2. `AppModel.sync`에서 동기화 완료 후 root 확인/생성 (파일시스템/DB 모두 정확히 반영된 상태)

### 장점
- sync 후라 파일시스템/DB 상태 정확히 확인 가능
- 기존 root 보존 보장
- 새 워크스페이스는 root 자동 생성
- `initializeApp` vs `sync` 역할 명확히 분리

## 영향 범위

### Backend (Main Process)
- **Model**: `/apps/desktop/src/main/model/tree/index.ts` - root 생성 제거
- **Model**: `/apps/desktop/src/main/model/app/index.ts` - sync 후 root 확인/생성

## 실행 계획

### Phase 1 (직렬)

| Agent | 작업 | 산출물 |
|-------|------|--------|
| be-model-generator | TreeModel + AppModel 수정 | 2개 파일 수정 |
| tester | 타입체크, 린트, 테스트 | 검증 결과 |

**직렬 이유**: 두 파일이 동시에 수정되어야 함. 하나만 수정시 버그 발생 가능.

## Agent별 상세 작업

### be-model-generator

#### 파일 1: `/apps/desktop/src/main/model/tree/index.ts`

**현재 코드** (6-13행):
```typescript
export async function initialize({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  await NodeModel.initialize({ workspaceDirPath })
  await NodeModel.addNode(ROOT_NODE)  // ← 제거
}
```

**수정 후**:
```typescript
export async function initialize({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  await NodeModel.initialize({ workspaceDirPath })
  // root 생성 제거 - sync 후 AppModel에서 처리
}
```

#### 파일 2: `/apps/desktop/src/main/model/app/index.ts`

**현재 코드** (35-45행):
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

**수정 후**:
```typescript
export async function sync(): Promise<void> {
  await AppRepo.sync()

  const workspaceDirPath = await AppRepo.getWorkspaceDirPath()
  if (!workspaceDirPath) {
    throw new Error('Workspace directory path not found')
  }

  await WorkspaceModel.sync({ workspaceDirPath })
  await NodeModel.sync({ workspaceDirPath })

  // sync 완료 후 root 확인/생성
  const rootExists = await NodeModel.isExist({ id: TreeModel.getRootNodeId() })
  if (!rootExists) {
    await NodeModel.addNode(ROOT_NODE)
  }
}
```

#### 필요한 import 추가

`app/index.ts`에 다음 import 추가:
```typescript
import { ROOT_NODE } from '../tree/const.js'
```

#### 근거

1. **정확성**: sync 후 확인이므로 파일시스템/DB 상태 정확히 반영
2. **안전성**: 어떤 상황에서도 기존 root 보존 보장
3. **명확성**:
   - `initializeApp`: 새 워크스페이스 전용 (root 생성 없음)
   - `sync`: 기존 워크스페이스 로드 + root 없으면 생성
4. **일관성**: 앱 시작 시 항상 `sync`를 거치므로 root 보장

#### 기존 함수 활용
- `NodeModel.isExist`: 이미 구현됨 (`node/index.ts` 36-38행)
- `TreeModel.getRootNodeId`: 이미 구현됨 (`tree/index.ts` 15-17행)
- `ROOT_NODE`: 상수 (`tree/const.ts`)

#### 산출물
- 수정된 `/apps/desktop/src/main/model/tree/index.ts`
- 수정된 `/apps/desktop/src/main/model/app/index.ts`

---

### tester

**작업**: 타입체크, 린트, 테스트 실행

#### 검증 항목

##### 컴파일 타임
- TypeScript 타입 체크 통과 (`pnpm typecheck`)
- ESLint 통과 (`pnpm lint`)

##### 테스트
- 기존 유닛 테스트 통과 (`pnpm test`)
  - `/apps/desktop/src/main/model/app/index.test.ts` 확인

##### 런타임 테스트 시나리오

1. **최초 실행 (새 워크스페이스)**
   - 워크스페이스 경로 선택
   - root node 정상 생성 확인
   - childIds: [] 확인

2. **재실행 (기존 워크스페이스 - 버그 재현 시나리오)**
   - 기존 워크스페이스로 재실행
   - root node가 덮어써지지 않는지 확인
   - 기존 childIds 유지 확인
   - title, content 유지 확인

3. **설정 초기화 후 기존 워크스페이스 선택**
   - 설정 파일 삭제
   - 기존 워크스페이스 경로 선택
   - root node 덮어써지지 않는지 확인 (핵심 시나리오)

4. **개발자 도구 확인**
   - SQLite DB에서 root node ID 일관성 확인
   - 파일시스템에서 root.json 변경 시간 확인

#### 산출물
- 테스트 결과 보고

---

## 예상 산출물

1. **Backend Model**: `/apps/desktop/src/main/model/tree/index.ts` - root 생성 제거
2. **Backend Model**: `/apps/desktop/src/main/model/app/index.ts` - sync 후 root 확인/생성

---

## 리스크 및 대응

### 리스크 1: TreeModel이 아닌 AppModel에서 root 관리

**문제**: root node 생성이 TreeModel이 아닌 AppModel에서 이루어짐

**대응**:
- 책임 분산이지만 의도적 선택
- sync는 항상 AppModel에서 시작하므로 root 보장에 적합
- TreeModel.initialize는 새 워크스페이스 전용으로 역할 명확화

### 리스크 2: import 순환 참조 가능성

**문제**: `app/index.ts`에서 `tree/const.ts` import시 순환 참조 발생 가능

**대응**:
- 현재 구조에서는 문제없음
- `tree/const.ts`는 순수 상수 파일이므로 의존성 없음
- 이미 `app/index.ts`가 `TreeModel`을 import하고 있음 (32행)

### 리스크 3: ROOT_NODE 상수 접근

**문제**: ROOT_NODE가 TreeModel에서 export되지 않음

**대응**:
- `tree/const.ts`에서 직접 import
- 또는 `TreeModel.getRootNodeId()` 사용 + ROOT_NODE는 별도 import

**선택**: `tree/const.ts`에서 직접 import (명확성)

---

## 검증 기준

- [ ] `pnpm typecheck` 통과
- [ ] `pnpm lint` 통과
- [ ] `pnpm test` 통과
- [ ] 최초 실행시 root node 생성 확인
- [ ] 재실행시 root node 유지 확인
- [ ] 설정 초기화 후 기존 워크스페이스 선택시 root 유지 확인
- [ ] 기존 childIds, title, content 유지 확인

---

## 다음 단계

1. Orchestrator에게 보고
2. **be-model-generator** 실행 요청 (2개 파일 동시 수정)
3. **tester**로 검증
