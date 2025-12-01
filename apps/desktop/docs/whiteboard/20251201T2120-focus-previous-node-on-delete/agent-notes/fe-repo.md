# Frontend Repo - focus-previous-node-on-delete

## 구현 개요

Renderer Repo 레이어에 `getPreviousFocusableNodeId` 함수를 추가하여 IPC를 통해 Backend Model과 통신하는 인터페이스를 구현했습니다.

## 구현된 Repo 함수

### `getPreviousFocusableNodeId`

**위치**: `/apps/desktop/src/renderer/repo/node.ts`

**시그니처**:
```typescript
export const getPreviousFocusableNodeId = ({
  id
}: {
  id: string
}): Promise<string | null>
```

**설명**:
- 주어진 노드 ID에 대해 삭제 시 포커스할 이전 노드 ID를 반환합니다.
- Backend IPC 핸들러 `node.getPreviousFocusableNodeId`를 호출합니다.

**반환값**:
- `Promise<string | null>`: 이전 포커스 대상 노드 ID 또는 `null`

**사용 예시**:
```typescript
import { getPreviousFocusableNodeId } from '@/renderer/repo/node'

const prevNodeId = await getPreviousFocusableNodeId({ id: 'node-123' })
```

## 외부 인터페이스

### Export
- `getPreviousFocusableNodeId({ id: string }): Promise<string | null>`

### Backend 연결 포인트

**IPC 핸들러**: `node.getPreviousFocusableNodeId`
- **위치**: `/apps/desktop/src/main/ipc/tree.ts`
- **Input**: `{ id: string }`
- **Output**: `Promise<string | null>`

## 검증 완료

- 타입 체크: 통과
- 기존 Repo 패턴 준수
- IPC 인터페이스와 일치

## 다음 단계

State 레이어에서 이 Repo 함수를 활용하는 로직 구현이 필요합니다.
