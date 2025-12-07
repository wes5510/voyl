# Node 삭제 시 이전 노드 포커스 기능 구현 계획

**작성일**: 2025-12-01
**작성자**: Planner Agent

## 작업 목표

노드 삭제 시 자동으로 이전 노드로 포커스가 이동하도록 기능 추가.

### 이전 노드 로직
- 이전 형제가 있으면 이전 형제로 이동
- 이전 형제가 없으면 부모 노드로 이동

### 핵심 원칙
- Backend에서 이전 노드 계산 로직 구현 (도메인 로직은 Model에)
- Frontend는 삭제 전 이전 노드 ID를 먼저 조회 후 삭제 실행
- 삭제 후 조회된 ID로 포커스 이동

## 영향 범위

### Backend (Main Process)
1. **Model Layer** (`main/model/node/index.ts`)
   - `getPreviousFocusableNodeId` 함수 추가

2. **IPC Layer** (`main/ipc/treeView.ts`)
   - `treeView.getPreviousFocusableNodeId` 핸들러 추가

### Frontend (Renderer Process)
3. **Repo Layer** (`renderer/repo/treeView.ts`)
   - `getPreviousFocusableNodeId` IPC 호출 함수 추가

4. **State Layer** (`renderer/state/treeView/hook.ts`)
   - `useGetPreviousFocusableNodeId` query hook 추가

5. **Page Layer** (`renderer/page/nodes/MainPanel/TreeView/TreeViewItem/TreeViewItemInput/useHandleBackspaceKey.ts`)
   - 삭제 전 `getPreviousFocusableNodeId` 호출
   - 삭제 후 `setTreeViewFocusedNodeId`로 포커스 이동

## Agent 할당 및 작업 내용

### 순차 실행 순서
1. **be-model-generator** (Backend Model)
2. **be-ipc-generator** (Backend IPC)
3. **fe-repo-generator** (Frontend Repo)
4. **fe-state-generator** (Frontend State)
5. **fe-page-generator** (Frontend Page - UI 로직 수정)
6. **tester** (검증)

---

## Phase 1: Backend Model 구현
**담당**: be-model-generator
**파일**: `/apps/desktop/src/main/model/node/index.ts`

### 작업 내용

1. `getPreviousFocusableNodeId` 함수 추가

```typescript
export async function getPreviousFocusableNodeId({
  id
}: {
  id: string
}): Promise<string | undefined> {
  const parentId = await NodeRepo.getParentId({ id })
  if (!parentId) {
    return undefined
  }

  const childIds = await NodeRepo.getChildIds({ id: parentId })
  const currentIndex = childIds.indexOf(id)

  if (currentIndex === 0) {
    // 첫 번째 자식이면 부모로
    return parentId
  }

  // 이전 형제로
  return childIds[currentIndex - 1]
}
```

### 참고 패턴
- 기존 함수: `getParentId` (40-42행), `getChildIndex` (44-53행)
- 유사 로직: Renderer의 `getPrevSiblingChildNodeId` (`renderer/model/tree/node/index.ts` 100-115행)

### 산출물
- `getPreviousFocusableNodeId` 함수 구현
- export 추가

---

## Phase 2: Backend IPC 핸들러 추가
**담당**: be-ipc-generator
**파일**: `/apps/desktop/src/main/ipc/treeView.ts`

### 작업 내용

1. treeViewHandlers 객체에 핸들러 추가

```typescript
import * as TreeViewModel from '../model/treeView/index.js'
import * as NodeModel from '../model/node/index.js'
import type { Node } from '../model/node/index.js'

export const treeViewHandlers = {
  'treeView.addNewNodeAfter': async ({ ... }): Promise<Node> => { ... },
  'treeView.removeNode': async ({ ... }): Promise<Node> => { ... },

  // 새로 추가
  'treeView.getPreviousFocusableNodeId': async ({
    nodeId,
  }: {
    nodeId: string
  }): Promise<string | undefined> => {
    return NodeModel.getPreviousFocusableNodeId({ id: nodeId })
  },
}
```

### 참고 패턴
- 기존 핸들러: `treeView.addNewNodeAfter` (5-16행), `treeView.removeNode` (18-25행)
- 채널명 규칙: `{namespace}.{camelCase}` (예: `treeView.removeNode`)

### 산출물
- `treeView.getPreviousFocusableNodeId` 핸들러 추가

---

## Phase 3: Frontend Repo 함수 추가
**담당**: fe-repo-generator
**파일**: `/apps/desktop/src/renderer/repo/treeView.ts`

### 작업 내용

1. IPC 호출 함수 추가

```typescript
export const getPreviousFocusableNodeId = async ({
  nodeId,
}: {
  nodeId: string
}): Promise<string | undefined> => {
  return window.api['treeView.getPreviousFocusableNodeId']({ nodeId })
}
```

### 참고 패턴
- 기존 함수: `addNewNodeAfter` (16-27행), `removeNode` (29-37행)
- window.api 사용: `window.api['treeView.{method}'](...)`

### 산출물
- `getPreviousFocusableNodeId` export 함수

---

## Phase 4: Frontend State Hook 추가
**담당**: fe-state-generator
**파일**: `/apps/desktop/src/renderer/state/treeView/hook.ts`

### 작업 내용

1. `useSuspenseQuery` 기반 조회 hook 추가

```typescript
import { getPreviousFocusableNodeId } from '@/renderer/repo/treeView'
import { TREE_VIEW_QUERY_KEYS } from './queryKey'

/**
 * 이전 포커스 노드 ID 조회
 */
export const useGetPreviousFocusableNodeId = ({
  nodeId
}: {
  nodeId: string
}) => {
  const { data } = useSuspenseQuery({
    queryKey: TREE_VIEW_QUERY_KEYS.previousFocusableNodeId({ nodeId }),
    queryFn: () => getPreviousFocusableNodeId({ nodeId }),
  })
  return data
}
```

2. Query Key 추가 필요 확인
   - `renderer/state/treeView/queryKey.ts`에 `previousFocusableNodeId` 키 추가

### 참고 패턴
- 기존 hook: `useTreeViewNodes` (34-37행) - useSuspenseQuery 사용
- mutation hook: `useAddNewNodeAfter` (42-61행) - useMutation 사용 (이 작업에서는 query만 필요)

### 산출물
- `useGetPreviousFocusableNodeId` hook
- Query key 추가
- Export 추가 (`renderer/state/treeView/index.ts`)

---

## Phase 5: Frontend Page 로직 수정
**담당**: fe-page-generator
**파일**: `/apps/desktop/src/renderer/page/nodes/MainPanel/TreeView/TreeViewItem/TreeViewItemInput/useHandleBackspaceKey.ts`

### 작업 내용

1. 삭제 전 이전 노드 조회 및 삭제 후 포커스 이동

```typescript
import { isHTMLTextAreaElement } from './shared/util'
import { HotkeyCallback } from 'react-hotkeys-hook'
import {
  useRemoveNode,
  useGetPreviousFocusableNodeId,
  setTreeViewFocusedNodeId
} from '@/renderer/state/treeView'

export default function useHandleBackspaceKey({
  nodeId,
}: {
  nodeId: string
}): HotkeyCallback {
  const removeNode = useRemoveNode()
  const previousFocusableNodeId = useGetPreviousFocusableNodeId({ nodeId })

  return async (e: KeyboardEvent) => {
    if (!isHTMLTextAreaElement(e.target) || e.target.value) {
      return
    }

    e.preventDefault()

    await removeNode({ nodeId })

    // 삭제 후 이전 노드로 포커스 이동
    if (previousFocusableNodeId) {
      setTreeViewFocusedNodeId({ nodeId: previousFocusableNodeId })
    }
  }
}
```

### 참고 패턴
- 포커스 이동: `useHandleEnterKey/index.ts` (40행) - `setTreeViewFocusedNodeId` 사용
- setTreeViewFocusedNodeId: `renderer/state/treeView/store.ts` (28-31행)

### 주의사항
- `useGetPreviousFocusableNodeId`는 useSuspenseQuery 사용하므로 컴포넌트가 마운트될 때 즉시 조회됨
- 삭제 전에 미리 조회되어 있으므로 바로 사용 가능
- undefined인 경우 포커스 이동 안 함 (부모 없는 경우)

### 산출물
- 수정된 `useHandleBackspaceKey` 로직

---

## Phase 6: 검증
**담당**: tester
**작업**: 타입체크, 린트, 기능 테스트

### 검증 항목

#### 컴파일 타임
- ✅ TypeScript 타입 체크 통과 (`pnpm typecheck`)
- ✅ ESLint 통과 (`pnpm lint`)

#### 런타임 테스트 시나리오
1. **중간 노드 삭제**
   - 부모 노드 아래 3개 자식 (A, B, C)
   - B 노드 삭제 → A로 포커스 이동 확인

2. **첫 번째 자식 노드 삭제**
   - 부모 노드 아래 3개 자식 (A, B, C)
   - A 노드 삭제 → 부모 노드로 포커스 이동 확인

3. **마지막 자식 노드 삭제**
   - 부모 노드 아래 3개 자식 (A, B, C)
   - C 노드 삭제 → B로 포커스 이동 확인

4. **단일 자식 노드 삭제**
   - 부모 노드 아래 1개 자식 (A)
   - A 노드 삭제 → 부모 노드로 포커스 이동 확인

### 산출물
- 테스트 결과 보고

---

## 예상 산출물

1. **Backend Model**: `main/model/node/index.ts` - `getPreviousFocusableNodeId` 함수
2. **Backend IPC**: `main/ipc/treeView.ts` - `treeView.getPreviousFocusableNodeId` 핸들러
3. **Frontend Repo**: `renderer/repo/treeView.ts` - `getPreviousFocusableNodeId` 함수
4. **Frontend State**: `renderer/state/treeView/hook.ts` - `useGetPreviousFocusableNodeId` hook
5. **Frontend State**: `renderer/state/treeView/queryKey.ts` - query key 추가
6. **Frontend Page**: `useHandleBackspaceKey.ts` - 포커스 이동 로직 추가

---

## 리스크 및 대응

### 리스크 1: useSuspenseQuery 사용으로 인한 불필요한 조회
**문제**: 모든 노드가 마운트될 때마다 이전 노드 ID를 조회하므로 성능 영향 가능

**대응 옵션**:
- A) 현재 방식 유지 (React Query 캐싱으로 중복 조회 방지)
- B) 삭제 시점에만 조회하도록 mutation 내부로 이동

**권장**: A (현재 방식)
- 이유:
  1. React Query가 자동으로 캐싱하므로 실제 네트워크 호출은 최소화됨
  2. 코드가 단순하고 선언적
  3. 노드 개수가 많지 않으면 성능 문제 미미

**대안** (B 선택 시):
삭제 함수 내부에서 직접 호출:
```typescript
const previousId = await getPreviousFocusableNodeId({ nodeId })
await removeNode({ nodeId })
if (previousId) {
  setTreeViewFocusedNodeId({ nodeId: previousId })
}
```

### 리스크 2: 부모 없는 노드 (루트 노드) 처리
**문제**: 루트 노드 삭제 시 undefined 반환

**대응**: 이미 처리됨
- `renderer/model/tree/index.ts` 297행에서 루트 노드 삭제 방지 로직 존재
- `getPreviousFocusableNodeId`는 undefined 반환만 하면 됨

### 리스크 3: React Query 캐시와 실제 노드 구조 불일치
**문제**: 노드 구조가 변경되었는데 이전 노드 ID 캐시가 stale한 경우

**대응**:
- 노드 추가/삭제 시 관련 쿼리 무효화 (이미 구현됨)
- `useRemoveNode`의 `onSuccess`에서 부모 노드 쿼리 무효화 (hook.ts 73-80행)

---

## 다음 단계

1. Orchestrator에게 보고
2. **be-model-generator** 먼저 실행 요청
