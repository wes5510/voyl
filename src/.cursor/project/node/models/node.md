# Node 모델 (Aggregate)

[Back to Architecture Overview](../arch.md)

## 책임

트리 구조의 기본 단위를 관리하며, 속성과 타입을 처리합니다.

## 속성

- `id: string`: 고유 식별자.
- `parentId?: string`: 부모 노드 ID (선택적).
- `childIds: string[]`: 자식 노드 ID 목록.
- `title: string`: 노드 제목.
- `attributes: Attribute[]`: 추가 속성.
- `type?: NodeType`: 노드 타입 (선택적).

## 행동

- `setTitle(newTitle: string): void`:
  - 설명:
    - 노드의 제목을 설정합니다.
    - 제목은 비어 있을 수 없습니다.
- `getTitle(): string`:
  - 설명:
    - 노드의 제목을 반환합니다.
- `getParentId(): string?`:
  - 설명:
    - 부모 노드 ID를 반환합니다.
    - 부모가 없으면 null을 반환합니다.
- `setParentId(parentId: string): void`:
  - 설명:
    - 부모 노드 ID를 설정합니다.
    - Tree의 moveNode로 대체 권장.
- `getChildIds(): string[]`:
  - 설명:
    - 자식 노드 ID 목록을 반환합니다.
- `removeChildId(nodeId: string): void`:
  - 설명:
    - 자식 노드 ID를 목록에서 제거합니다.
- `insertChildId(newNodeId: string, index: number): void`:
  - 설명:
    - 지정된 인덱스에 자식 노드 ID를 삽입합니다.
    - 인덱스는 0 이상이어야 합니다.
- `getChildIndex(childId: string): number`:
  - 설명:
    - 자식 노드 ID의 인덱스를 반환합니다.
    - 없으면 -1을 반환합니다.
- `getPrevSiblingChildId(childId: string): string?`:
  - 설명:
    - 자식 노드의 이전 형제 노드 ID를 반환합니다.
    - 첫 번째 자식이면 null을 반환합니다.
- `getLastChildIndex(): number`:
  - 설명:
    - 마지막 자식 노드의 인덱스를 반환합니다.
    - 자식이 없으면 -1을 반환합니다.
- `addAttribute(attribute: Attribute): void`:
  - 설명:
    - 새 속성을 추가합니다.
    - 속성은 노드 타입에 따라 유효성이 검사됩니다.
- `updateAttribute(id: string, value: unknown): void`:
  - 설명:
    - 지정된 ID의 속성 값을 수정합니다.
- `removeAttribute(id: string): void`:
  - 설명:
    - 지정된 ID의 속성을 제거합니다.
