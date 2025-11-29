# TDD (Test-Driven Development)

테스트 주도 개발을 권장한다.

## 왜 TDD인가?

- 요구사항을 먼저 명확히 정의하게 됨
- 테스트 가능한 설계로 자연스럽게 유도됨
- 리팩토링 시 안전망 역할

## Red-Green-Refactor

### 1. Red: 실패하는 테스트 작성

```typescript
it('should return sum of two numbers', () => {
  expect(add(1, 2)).toBe(3)
})
// ❌ ReferenceError: add is not defined
```

### 2. Green: 테스트를 통과하는 최소한의 코드

```typescript
const add = (a: number, b: number) => a + b
// ✅ Test passed
```

### 3. Refactor: 코드 정리

테스트가 통과하는 상태를 유지하면서 코드를 개선한다.

## 핵심 원칙

- 테스트 없이 프로덕션 코드를 작성하지 않는다
- 실패하는 테스트가 있을 때만 프로덕션 코드를 작성한다
- 테스트를 통과하는 최소한의 코드만 작성한다
