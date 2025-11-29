# useEffect 가이드

> 참고: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

## 핵심 원칙

**useEffect는 외부 시스템과의 동기화가 필요할 때만 사용한다.**

외부 시스템: API 호출, 브라우저 API, 서드파티 라이브러리

## useEffect가 필요 없는 케이스

### 1. 렌더링을 위한 데이터 변환

```tsx
// Bad
const [filteredNodes, setFilteredNodes] = useState([])
useEffect(() => {
  setFilteredNodes(nodes.filter(n => !n.archived))
}, [nodes])

// Good: 렌더링 중에 계산
const filteredNodes = nodes.filter(n => !n.archived)
```

### 2. 사용자 이벤트 처리

```tsx
// Bad
useEffect(() => {
  if (submitted) {
    saveNode(node)
  }
}, [submitted])

// Good: 이벤트 핸들러에서 직접 처리
const handleSubmit = () => {
  saveNode(node)
}
```

### 3. Props/상태 기반 상태 업데이트

```tsx
// Bad
const [fullName, setFullName] = useState('')
useEffect(() => {
  setFullName(`${firstName} ${lastName}`)
}, [firstName, lastName])

// Good: 렌더링 중에 계산
const fullName = `${firstName} ${lastName}`
```

### 4. 비용이 큰 계산

```tsx
// Bad
const [result, setResult] = useState(null)
useEffect(() => {
  setResult(expensiveCalculation(data))
}, [data])

// Good: useMemo 사용
const result = useMemo(() => expensiveCalculation(data), [data])
```

### 5. Props 변경 시 상태 초기화

```tsx
// Bad
useEffect(() => {
  setContent(node.content)
}, [node.id])

// Good: key prop 사용
<Editor key={node.id} initialContent={node.content} />
```

## useEffect가 필요한 케이스

```tsx
// IPC 호출 (외부 시스템)
useEffect(() => {
  window.api.onNodeUpdated((node) => {
    queryClient.invalidateQueries(['nodes'])
  })
}, [])

// 브라우저 API
useEffect(() => {
  const handler = (e: KeyboardEvent) => { /* ... */ }
  window.addEventListener('keydown', handler)
  return () => window.removeEventListener('keydown', handler)
}, [])
```
