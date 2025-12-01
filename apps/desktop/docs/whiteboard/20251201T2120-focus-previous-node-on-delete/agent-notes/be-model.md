# Backend Model - Node 삭제 시 이전 노드 포커스 기능

## 구현 개요

`NodeModel`에 `getPreviousFocusableNodeId` 함수를 추가하여 노드 삭제 시 포커스할 이전 노드 ID를 계산하는 로직을 구현했습니다.

## 구현된 함수

### `getPreviousFocusableNodeId`

**위치**: `/apps/desktop/src/main/model/node/index.ts`

**시그니처**:
```typescript
export async function getPreviousFocusableNodeId({
  id,
}: {
  id: string
}): Promise<string | null>
```

**로직**:
1. 주어진 `id`의 부모 노드 ID를 가져옴 (`NodeRepo.getParentId`)
2. 부모가 없으면 `null` 반환
3. 부모의 자식 노드 ID 리스트를 가져옴 (`NodeRepo.getChildIds`)
4. 현재 노드의 인덱스를 찾음
5. 인덱스가 0이면 (첫 번째 자식) 부모 ID 반환
6. 그렇지 않으면 이전 형제 노드 ID 반환 (`childIds[currentIndex - 1]`)

**반환값**:
- `string`: 이전에 포커스할 노드의 ID (부모 또는 이전 형제)
- `null`: 부모가 없는 경우 (루트 노드)

## 외부 인터페이스

### Export

- `getPreviousFocusableNodeId({ id: string }): Promise<string | null>`

### 의존성

- `NodeRepo.getParentId({ id })`
- `NodeRepo.getChildIds({ id })`

## 연결 포인트

### IPC 연결

`TreeViewModel.removeNode`에서 이 함수를 호출하여 삭제 전 이전 노드 ID를 계산하고, IPC 응답에 포함시킬 수 있습니다.

**위치**: `/apps/desktop/src/main/model/treeView/index.ts`

**예상 사용**:
```typescript
export async function removeNode({ nodeId }: { nodeId: string }): Promise<Node & { previousNodeId?: string }> {
  const previousNodeId = await NodeModel.getPreviousFocusableNodeId({ id: nodeId })

  // 기존 삭제 로직...

  return { ...node, previousNodeId }
}
```

### Repo 계층

이 함수는 `NodeRepo`의 다음 함수들을 사용합니다:
- `getParentId({ id })`
- `getChildIds({ id })`

## 테스트 시나리오

1. **중간 자식 노드 삭제**: 이전 형제 노드 ID 반환
2. **첫 번째 자식 노드 삭제**: 부모 노드 ID 반환
3. **마지막 자식 노드 삭제**: 이전 형제 노드 ID 반환
4. **부모 없는 노드** (루트): `null` 반환

## 검증 완료

- 타입 체크: 통과
- 린트: 통과
