# ref 가이드

> 참고: [Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs)

## ref란?

`useRef`로 생성하는 `{ current: value }` 객체. 컴포넌트가 "기억"해야 하지만 **렌더링을 트리거하지 않는** 값을 저장한다.

## ref vs state

| 항목 | ref | state |
|------|-----|-------|
| 재렌더링 | 트리거 안 함 | 트리거 함 |
| 변경 방식 | 직접 변경 (`ref.current = x`) | setter 함수 필요 |
| 렌더링 중 읽기 | 금지 | 가능 |

## 사용해야 할 때

```tsx
// 1. 타임아웃/인터벌 ID 저장
const timeoutRef = useRef<NodeJS.Timeout | null>(null)

const handleClick = () => {
  if (timeoutRef.current) clearTimeout(timeoutRef.current)
  timeoutRef.current = setTimeout(() => { /* ... */ }, 1000)
}

// 2. DOM 요소 접근
const inputRef = useRef<HTMLInputElement>(null)

const focusInput = () => {
  inputRef.current?.focus()
}

return <input ref={inputRef} />

// 3. 이전 값 저장 (렌더링에 사용하지 않음)
const prevValueRef = useRef(value)
useEffect(() => {
  prevValueRef.current = value
}, [value])
```

## 사용하면 안 될 때

```tsx
// Bad: 렌더링 출력에 필요한 값
const countRef = useRef(0)
const handleClick = () => { countRef.current++ }
return <div>{countRef.current}</div> // 클릭해도 UI 안 바뀜

// Good: state 사용
const [count, setCount] = useState(0)
const handleClick = () => { setCount(c => c + 1) }
return <div>{count}</div>
```

## 핵심 규칙

**정보가 렌더링에 사용되면 state, 아니면 ref**
