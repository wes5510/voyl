# Node 모델 (Aggregate)

[Back to Architecture Overview](../arch.md)

## 책임

트리 구조의 기본 단위를 관리하며, 속성 ID 목록과 타입을 처리합니다.

## 속성

- `id: string`: 고유 식별자.
- `parentId?: string`: 부모 노드 ID.
- `index: string`: 형제 노드 간의 순서를 결정하는 정렬 키(Lexicographical Order Key)
- `title: string`: 노드 제목.
- `attributeIds: string[]`: 이 노드에 연결된 Attribute(속성)들의 ID 목록입니다.
- `typeId?: string`: NodeType ID.
- `content?: string`: 노드의 상세 내용. TipTap 등의 콘텐츠.

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
    - 부모가 없으면 undefined을 반환합니다.
- `setParentId(parentId?: string): void`:
  - 설명:
    - 노드의 parentId 필드를 설정합니다. parentId로 undefined을 전달하면 최상위 노드가 됩니다.
    - 이 메소드는 parentId 필드만 변경하며, 변경된 부모 관계에 따른 index 값 조정이나 이전/새로운 부모의 자식 목록 관리는 TreeService와 같은 상위 서비스에서 처리해야 합니다.
- `getIndex(): string`:
  - 설명:
    - 부모 노드에서의 현재 Node 순서를 반환합니다.
- `setIndex(index: string): void`:
  - 설명:
    - 형제 노드 간의 순서를 결정하는 정렬 키를 설정합니다.
    - index 값 자체의 생성 로직, 예를 들어 두 형제 노드 index 사이의 중간 값을 찾는 등의 계산은 TreeService와 같은 상위 서비스의 책임입니다.
- `linkAttribute(attributeId: string): void`:
  - 설명:
    - 기존에 생성된 Attribute의 ID를 이 Node의 `attributeIds` 목록에 추가하여 연결합니다.
- `updateAttributeValue(attributeId: string, value: unknown): void`:
  - 설명:
    - 지정된 ID를 가진 Attribute의 `value`를 수정합니다.
    - 이 작업은 일반적으로 `AttributeService`를 통해 수행됩니다.
    - 이 Node의 `attributeIds` 목록에 해당 `attributeId`가 있는지 확인하는 로직이 선행될 수 있습니다.
- `unlinkAttribute(attributeId: string): void`:
  - 설명:
    - 이 Node의 `attributeIds` 목록에서 지정된 `attributeId`를 제거합니다.
    - (참고) 연결 해제된 Attribute 객체 자체를 데이터베이스에서 삭제할지 여부는 별도 정책/함수에 따릅니다. (NodeService에서는 연결 해제 및 Attribute 삭제 동시 진행 예정)
