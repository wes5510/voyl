# 트리뷰 아키텍처 설계

## 문제

- topNode 아래 수천 개 노드 처리 필요
- 현재 구조는 전체 nodeTable 메모리 로딩으로 한계

## 해결 방안

1. **지연 로딩**: TreeViewItem 마운트시 개별 노드 로딩
2. **dnd-kit**: verticalListSortingStrategy 사용
3. **prefetch**: 백그라운드에서 성능 최적화

## 데이터 구조

```typescript
// 노드 (구조 + 상세 정보 통합)
type Node = {
  id: string
  parentId: string | null
  index: string
  childIds: string[]
  title: string
  content: string
  attributes: Attribute[]
  typeId: string
}

// 트리뷰 아이템 (평면화)
type TreeViewItem = {
  nodeId: string
  depth: number
}
```

## 로딩 전략

### 1. 트리뷰 로딩

```typescript
const useTreeView = (topNodeId: string) => {
  const { data: treeViewItems } = useSuspenseQuery({
    queryKey: ['view', 'tree', topNodeId],
    queryFn: () => fetchTreeView(topNodeId)
  })
  return treeViewItems
}
```

### 2. 개별 노드 로딩

```typescript
const TreeViewItemComponent = ({ nodeId, depth }) => {
  const { data: node } = useSuspenseQuery({
    queryKey: ['node', nodeId],
    queryFn: () => fetchNode(nodeId)
  })

  return (
    <div style={{ paddingLeft: depth * 20 }}>
      <span>{node.title}</span>
    </div>
  )
}
```

### 3. 백그라운드 최적화

```typescript
useEffect(() => {
  visibleNodeIds.forEach(nodeId => {
    queryClient.prefetchQuery({
      queryKey: ['node', nodeId],
      queryFn: () => fetchNode(nodeId)
    })
  })
}, [visibleNodeIds])
```

## 캐싱

### 캐시 키

```typescript
// 트리뷰 구조 (30분 캐싱)
queryKey: ['view', 'tree', topNodeId]

// 개별 노드 (30분 캐싱)
queryKey: ['node', nodeId]
```

### 캐시 무효화

```typescript
// 노드 변경시 관련 캐시 무효화
const invalidateAfterNodeChange = (nodeId: string, parentId?: string) => {
  queryClient.invalidateQueries({
    queryKey: ['view', 'tree', topNodeId]
  })
  queryClient.invalidateQueries({
    queryKey: ['node', nodeId]
  })
  if (parentId) {
    queryClient.invalidateQueries({
      queryKey: ['node', parentId]
    })
  }
}
```

## 성능 최적화

### dnd-kit 설정

```typescript
import { verticalListSortingStrategy } from '@dnd-kit/sortable'

const optimizedDndContext = {
  collisionDetection: closestCenter,
  sensors: useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  )
}
```

### 컴포넌트 메모이제이션

```typescript
const TreeViewItemComponent = memo(({ nodeId, depth }) => {
  const { data: node } = useSuspenseQuery({
    queryKey: ['node', nodeId],
    queryFn: () => fetchNode(nodeId),
    staleTime: 30 * 60 * 1000
  })

  return <OptimizedNodeComponent node={node} depth={depth} />
})
```

### 메모리 관리

- 트리 구조는 가벼운 데이터만 (nodeId, depth)
- 노드 상세 정보는 필요할 때만 로딩
- React Query 캐시 정책으로 메모리 관리

## 구현 순서

1. **백엔드 API**: `GET /view/tree/:topNodeId`, `GET /tree/nodes/:nodeId`
2. **React Query 설정**: queryKey 전략, staleTime 설정
3. **dnd-kit 트리뷰**: verticalListSortingStrategy 적용
4. **TreeViewItem 컴포넌트**: useSuspenseQuery로 개별 노드 로딩
5. **성능 최적화**: 메모이제이션, prefetch

## 결론

복잡한 chunk 로딩 대신 단순한 지연 로딩으로 수천 개 노드를 처리:

- TreeViewItem 마운트시 지연 로딩으로 초기 성능 최적화
- dnd-kit verticalListSortingStrategy로 드래그 성능
- 백그라운드 prefetch로 사용자 경험 개선
- 통합된 Node 타입으로 구현 단순성 확보

---

**작성일**: 2025-07-06  
**상태**: 아키텍처 설계 완료, 구현 대기
