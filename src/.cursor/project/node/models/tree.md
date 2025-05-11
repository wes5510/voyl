# Tree 모델 (Aggregate)

[Back to Architecture Overview](../arch.md)

## 책임

전체 트리 구조를 관리하며, 노드의 추가와 제거를 처리합니다.

## 속성

- `rootNodeId: string`: 루트 노드 ID.
- `nodeTable: NodeTable`: 노드 테이블.

## 행동

- `createNewNode(title?: string, parentId?: string, nodeType?: NodeType): string`:
  - 설명:
    - 새 노드를 생성하고, 트리에 추가합니다.
    - 생성된 노드의 ID를 반환합니다.
- `getTitleByNodeId(nodeId: string): string`:
  - 설명:
    - 지정된 노드 ID의 제목을 반환합니다.
- `setTitleByNodeId(nodeId: string, title: string): void`:
  - 설명:
    - 지정된 노드 ID의 제목을 설정합니다.
- `insertNewNodeAfter(sourceNode: Node, newNodeTitle: string, nested: boolean): void`:
  - 설명:
    - 지정된 노드 뒤에 새 노드를 삽입합니다.
    - `nested`가 true면 자식으로 추가됩니다.
- `moveToChildNode(parentNodeId: string, newNodeId: string, index: number): void`:
  - 설명:
    - 지정된 노드를 부모 노드의 자식으로 이동합니다.
    - `index`는 삽입 위치를 지정합니다.
- `getNodeTable(): NodeTable`:
  - 설명:
    - 노드 테이블을 반환합니다.
- `removeNodeByNodeId(nodeId: string): void`:
  - 설명:
    - 지정된 노드 ID의 노드를 제거합니다.
- `outdentNode(nodeId: string): void`:
  - 설명:
    - 지정된 노드를 상위 수준으로 이동합니다.
- `indentNode(nodeId: string): void`:
  - 설명:
    - 지정된 노드를 하위 수준으로 이동합니다.
- `getRootNodeId(): string`:
  - 설명:
    - 루트 노드 ID를 반환합니다.
