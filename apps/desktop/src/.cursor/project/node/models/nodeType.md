# NodeType 모델 (Entity)

[Back to Architecture Overview](../arch.md)

## 책임

노드 유형을 정의하고, 유형별 허용 속성을 관리합니다.

## 속성

- `id: string`: 고유 식별자.
- `name: string`: 유형 이름.
- `definedAttributeNames: string[]`: 유형별 허용 속성 이름 목록.

## 행동

- `getDefinedAttributeNames(): string[]`:
  - 설명:
    - 유형에 허용된 속성 이름 목록을 반환합니다.
