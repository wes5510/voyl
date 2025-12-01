# Frontend State - focus-previous-node-on-delete

## 구현 개요

TreeView State 레이어에서 `getPreviousFocusableNodeId` 함수를 re-export하여 Page 레이어에서 삭제 직전 호출할 수 있도록 했습니다.

## 설계 결정

### Query Hook vs 직접 함수 export

**선택**: 직접 함수 export (re-export)

**이유**:
1. **삭제 직전 한 번만 호출**: React Query 캐싱 불필요
2. **단순성**: `useSuspenseQuery` 래핑 없이 직접 호출 가능
3. **성능**: 불필요한 컴포넌트 마운트 시 조회 방지
4. **기존 패턴 일치**: `updateNodeTitle`도 동일 방식으로 export됨 (tree/index.ts:10)

### 구현 방식

**위치**: `/apps/desktop/src/renderer/state/treeView/hook.ts`

```typescript
import { getPreviousFocusableNodeId } from '@/renderer/repo/node'

// ...

/**
 * 이전 포커스 가능한 노드 ID 조회
 * (삭제 직전 호출용, 직접 repo 함수를 re-export)
 */
export { getPreviousFocusableNodeId }
```

**Export**: `/apps/desktop/src/renderer/state/treeView/index.ts`

```typescript
export {
  useTopNodeId,
  useFocusedNodeId,
  useTreeViewNodes,
  useAddNewNodeAfter,
  useRemoveNode,
  getPreviousFocusableNodeId,  // 추가
} from './hook'
```

## 외부 인터페이스

### Export 함수

- `getPreviousFocusableNodeId({ id: string }): Promise<string | null>`

### 사용 예시 (Page 레이어)

```typescript
import {
  useRemoveNode,
  getPreviousFocusableNodeId,
  setTreeViewFocusedNodeId
} from '@/renderer/state/treeView'

export default function useHandleBackspaceKey({ nodeId }: { nodeId: string }) {
  const removeNode = useRemoveNode()

  return async (e: KeyboardEvent) => {
    // 삭제 직전 이전 노드 ID 조회
    const previousNodeId = await getPreviousFocusableNodeId({ id: nodeId })

    // 노드 삭제
    await removeNode({ nodeId })

    // 포커스 이동
    if (previousNodeId) {
      setTreeViewFocusedNodeId({ nodeId: previousNodeId })
    }
  }
}
```

## 연결 포인트

### Repo 연결

- **Repo 함수**: `getPreviousFocusableNodeId` (`renderer/repo/node.ts`)
- **Backend IPC**: `node.getPreviousFocusableNodeId`
- **Backend Model**: `NodeModel.getPreviousFocusableNodeId`

### Page 연결

- **예상 사용처**: `renderer/page/.../useHandleBackspaceKey.ts`
- **Import**: `import { getPreviousFocusableNodeId } from '@/renderer/state/treeView'`
- **호출 시점**: `removeNode` 호출 전

## 검증 완료

- 타입 체크: 통과
- ESLint: 통과
- State 레이어 규칙 준수:
  - Repo 함수 re-export
  - 기존 패턴 일치 (`updateNodeTitle`과 동일 방식)

## 다음 단계

Page 레이어에서 `useHandleBackspaceKey` 로직 수정이 필요합니다.
