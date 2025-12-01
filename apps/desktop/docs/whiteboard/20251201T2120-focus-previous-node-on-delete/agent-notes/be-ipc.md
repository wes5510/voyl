# Backend IPC - focus-previous-node-on-delete

## 구현 내역

### 추가된 IPC 핸들러

#### `node.getPreviousFocusableNodeId`

**위치**: `/apps/desktop/src/main/ipc/tree.ts`

**시그니처**:
```typescript
'node.getPreviousFocusableNodeId': async ({
  id,
}: {
  id: string
}): Promise<string | null>
```

**설명**: 노드 삭제 시 포커스할 이전 노드의 ID를 반환합니다.

**로직**:
- `NodeModel.getPreviousFocusableNodeId({ id })` 호출
- 동일 레벨의 이전 형제 노드 또는 부모 노드 ID 반환
- 부모가 없으면 `null` 반환

**사용 예시**:
```typescript
// Frontend에서 호출
const prevNodeId = await window.api['node.getPreviousFocusableNodeId']({ id: 'node-id' })
```

## Frontend 연결 포인트

### Renderer Repo Layer
- 위치: `/apps/desktop/src/renderer/repo/node/`
- Frontend에서 IPC를 통해 호출할 함수를 정의할 위치
- 예: `getPreviousFocusableNodeId({ id }: { id: string }): Promise<string | null>`

### State Layer
- 위치: `/apps/desktop/src/renderer/state/node/`
- React Query를 사용하여 repo 함수를 호출하는 훅 정의
- 예: `usePreviousFocusableNodeId(nodeId: string)`

## 검증

- 타입 체크 통과 확인
- 기존 IPC 핸들러 패턴 일관성 유지
