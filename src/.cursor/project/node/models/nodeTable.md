# NodeTable 모델 (Value Object)

[Back to Architecture Overview](../arch.md)

## 책임

Node ID와 Node의 관계를 관리합니다.

## 속성

- `table: Map<string, Node>`: 노드 ID와 노드 객체의 매핑.

## 행동

- `setNode(node: Node): void`:
  - 설명:
    - 노드를 테이블에 추가하거나 업데이트합니다.
- `getNode(nodeId: string): Node`:
  - 설명:
    - 지정된 노드 ID의 노드를 반환합니다.
- `removeNodes(nodeIds: string[]): void`:
  - 설명:
    - 지정된 노드 ID 목록의 노드를 제거합니다.
- `isExistNode(nodeId: string): boolean`:
  - 설명:
    - 지정된 노드 ID가 테이블에 존재하는지 확인합니다.
