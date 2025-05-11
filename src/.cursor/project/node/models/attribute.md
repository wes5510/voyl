# Attribute 모델 (Entity)

[Back to Architecture Overview](../arch.md)

## 책임

노드에 추가적인 정보를 제공하는 속성을 관리합니다.

## 속성

- `id: string`: 고유 식별자.
- `name: string`: 속성 이름.
- `value: unknown`: 속성 값.

## 행동

- `setValue(value: unknown): void`:

  - 설명:
    - 속성의 값을 설정합니다.

- `getValue(): unknown`:
  - 설명:
    - 속성의 값을 반환합니다.
