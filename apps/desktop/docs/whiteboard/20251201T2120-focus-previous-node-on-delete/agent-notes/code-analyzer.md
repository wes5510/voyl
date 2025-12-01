# Code Analyzer - Node 삭제 시 이전 노드 포커스 기능

## 분석 개요

노드 삭제 시 이전 노드로 포커스를 이동하는 기능 구현을 위한 코드 분석 결과입니다.

## 1. 노드 삭제 플로우

### 1.1 사용자 인터랙션 → 삭제 실행
```
useHandleBackspaceKey (UI 레이어)
  ↓
useRemoveNode (State 레이어)
  ↓
removeNode (Repo 레이어, IPC 호출)
  ↓
treeViewHandlers['treeView.removeNode'] (Main IPC)
  ↓
TreeViewModel.removeNode (Main Model)
  ↓
NodeModel.removeNode (Main Model)
```

**핵심 파일:**
- `/apps/desktop/src/renderer/page/nodes/MainPanel/TreeView/TreeViewItem/TreeViewItemInput/useHandleBackspaceKey.ts`
  - Backspace 키 입력 시 빈 노드 삭제
  - `useRemoveNode()` 호출

- `/apps/desktop/src/renderer/state/treeView/hook.ts` (66-90행)
  - `useRemoveNode` mutation hook
  - 삭제 성공 시 React Query 캐시 무효화만 처리
  - **포커스 처리 없음** ← 여기에 추가 필요

- `/apps/desktop/src/main/model/treeView/index.ts` (135-148행)
  - 실제 노드 삭제 로직
  - 부모에서 childId 제거, 자식 노드들 제거, 노드 자체 제거
  - 삭제된 노드 반환

## 2. 포커스 관리 메커니즘

### 2.1 포커스 상태 저장소
**파일:** `/apps/desktop/src/renderer/state/treeView/store.ts`
```typescript
export const treeViewStore = proxy<TreeViewEntity>({
  focusedNodeId: undefined,  // 현재 포커스된 노드 ID
  // ...
})

export const setTreeViewFocusedNodeId = ({ nodeId }: { nodeId: string }) => {
  const updated = setFocusedNodeId({ entity: treeViewStore, nodeId })
  treeViewStore.focusedNodeId = updated.focusedNodeId
}
```

### 2.2 포커스 적용
**파일:** `/apps/desktop/src/renderer/page/nodes/MainPanel/TreeView/TreeViewItem/TreeViewItemInput/useFocus.ts`
```typescript
export default function useFocus({ nodeId, ref }) {
  const focused = useFocusedNodeId() === nodeId

  useEffect(() => {
    if (focused) {
      ref.current?.focus()  // DOM 포커스 실행
    }
  }, [focused, nodeId, ref])
}
```

### 2.3 포커스 이동 참고 사례
**파일:** `/apps/desktop/src/renderer/page/nodes/MainPanel/TreeView/TreeViewItem/TreeViewItemInput/useHandleEnterKey/index.ts` (40행)
```typescript
const newNode = await addNewNodeAfter({ nodeId, title })
setTreeViewFocusedNodeId({ nodeId: newNode.id })  // 새 노드로 포커스 이동
```

## 3. 이전 노드 찾기

### 3.1 노드 구조
**파일:** `/apps/desktop/src/renderer/model/tree/node/index.ts`
```typescript
export interface NodeEntity {
  id: NodeEntityId
  parentNodeId?: NodeEntityId
  childNodeIds: NodeEntityId[]
  task: TaskEntity
}
```

### 3.2 이전 형제 노드 찾기 유틸리티 (이미 존재)
**파일:** `/apps/desktop/src/renderer/model/tree/node/index.ts` (100-115행)
```typescript
export const getPrevSiblingChildNodeId = ({
  entity,
  childNodeId,
}: {
  entity: NodeEntity
  childNodeId: NodeEntityId
}) => {
  const childNodeIds = getChildNodeIds({ entity })
  const index = childNodeIds.indexOf(childNodeId)

  if (index === 0) {
    return undefined  // 첫 번째 자식인 경우
  }

  return childNodeIds[index - 1]
}
```

**Backend에서도 유사한 로직 필요:**
- `/apps/desktop/src/main/model/node/index.ts`
  - `getParentId({ id })` 존재 (40-42행)
  - `getChildIndex({ id, childId })` 존재 (44-53행)
  - **`getPrevSiblingId` 함수 필요** ← 새로 추가

## 4. 수정 필요 위치

### 4.1 Backend (Main Process)

**파일:** `/apps/desktop/src/main/model/treeView/index.ts`
```typescript
export async function removeNode({ nodeId }: { nodeId: string }): Promise<Node> {
  logger.debug({ nodeId }, 'Remove Node')
  const node = await NodeModel.getNodeById({ id: nodeId })

  if (!node) {
    throw new Error('Node not found')
  }

  // TODO: 삭제 전에 이전 노드 ID 찾기
  // 1. 부모 노드의 childIds 가져오기
  // 2. 현재 노드의 인덱스 찾기
  // 3. index - 1의 노드 ID 가져오기
  // 4. index === 0이면 부모 노드 ID 반환

  await NodeModel.removeChildIdFromParentNode({ id: nodeId })
  await NodeModel.removeChildNodes({ id: nodeId })
  await NodeModel.removeNode({ id: nodeId })

  return node  // TODO: { node, previousNodeId } 형태로 반환 고려
}
```

**새 함수 추가 필요:** `/apps/desktop/src/main/model/node/index.ts`
```typescript
export async function getPreviousFocusableNodeId({ id }: { id: string }): Promise<string | undefined> {
  const parentId = await getParentId({ id })
  if (!parentId) return undefined

  const childIds = await NodeRepo.getChildIds({ id: parentId })
  const currentIndex = childIds.indexOf(id)

  if (currentIndex === 0) {
    return parentId  // 첫 번째 자식이면 부모로
  }

  return childIds[currentIndex - 1]  // 이전 형제로
}
```

### 4.2 Frontend (Renderer Process)

**파일:** `/apps/desktop/src/renderer/state/treeView/hook.ts`
```typescript
export const useRemoveNode = () => {
  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: removeNode,
    onSuccess: (removedNode: NodeDTO) => {
      // TODO: removedNode에 previousNodeId 포함되면
      // setTreeViewFocusedNodeId({ nodeId: previousNodeId })

      if (removedNode.parentId) {
        queryClient.invalidateQueries({
          queryKey: TREE_VIEW_QUERY_KEYS.nodes({
            topNodeId: removedNode.parentId,
          }),
        })
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.node({ nodeId: removedNode.parentId }),
        })
      }

      queryClient.setQueryData(
        QUERY_KEYS.node({ nodeId: removedNode.id }),
        null,
      )
    },
  })
  return mutateAsync
}
```

## 5. 영향 범위

### 5.1 수정 필요 파일
1. `/apps/desktop/src/main/model/node/index.ts`
   - `getPreviousFocusableNodeId` 함수 추가

2. `/apps/desktop/src/main/model/treeView/index.ts`
   - `removeNode` 함수 수정 (이전 노드 ID 계산 및 반환)

3. `/apps/desktop/src/main/ipc/treeView.ts`
   - 타입 변경 반영 (필요시)

4. `/apps/desktop/src/renderer/repo/treeView.ts`
   - 타입 변경 반영 (필요시)

5. `/apps/desktop/src/renderer/state/treeView/hook.ts`
   - `useRemoveNode` onSuccess에서 포커스 이동 추가

### 5.2 테스트 필요 시나리오
1. 형제 노드 중간에 있는 노드 삭제 → 이전 형제로 포커스
2. 첫 번째 자식 노드 삭제 → 부모 노드로 포커스
3. 마지막 자식 노드 삭제 → 이전 형제로 포커스
4. 부모가 없는 노드 삭제 (루트) → 에러 (이미 방지됨, line 297)

### 5.3 주의사항
- 루트 노드는 삭제 불가 (이미 처리됨, `/apps/desktop/src/renderer/model/tree/index.ts` 297행)
- React Query 캐시 무효화 타이밍과 포커스 이동 타이밍 고려 필요
- 삭제된 노드가 화면에서 사라지기 전에 포커스가 이동해야 함

## 6. 구현 전략

### 옵션 A: Backend에서 previousNodeId 반환
- **장점**: Frontend에서 노드 구조 모를 필요 없음, 로직 일관성
- **단점**: API 응답 구조 변경 필요

### 옵션 B: Frontend에서 삭제 전 계산
- **장점**: Backend 수정 최소화
- **단점**: Frontend에서 노드 구조 조회 필요, React Query 캐시 의존

## Needs User Decision

- **결정 필요**: Backend에서 previousNodeId를 반환할지, Frontend에서 삭제 전 계산할지
- **옵션**:
  - A) Backend에서 `removeNode` 응답에 `previousNodeId` 포함
  - B) Frontend에서 삭제 전 부모 노드 조회하여 이전 노드 ID 계산
- **권장**: 옵션 A
  - 이유:
    1. 노드 구조 로직은 Backend(Model)에 있는 것이 레이어 원칙 준수
    2. Frontend는 UI 로직에만 집중
    3. 이미 `getPrevSiblingChildNodeId` 유사 로직 존재 (renderer/model/tree/node)
    4. Backend에 `getParentId`, `getChildIds` 이미 구현되어 있어 추가 구현 간단
