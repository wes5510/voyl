# 단일 책임 원칙 (Single Responsibility Principle)

설계, 컴포넌트, 함수 모두 **한 가지 책임**만 가져야 한다.

## 왜 중요한가?

- 변경의 이유가 하나뿐이면 수정 범위가 명확해진다
- 테스트가 쉬워진다
- 재사용성이 높아진다

## 함수

```typescript
// Bad: 두 가지 책임 (검증 + 저장)
const saveNode = async (node: Node) => {
  if (!node.title) throw new Error('Title required')
  if (!node.parentId) throw new Error('Parent required')
  await db.insert(node)
}

// Good: 책임 분리
const validateNode = (node: Node) => {
  if (!node.title) throw new Error('Title required')
  if (!node.parentId) throw new Error('Parent required')
}

const saveNode = async (node: Node) => {
  await db.insert(node)
}
```

## 컴포넌트

```tsx
// Bad: UI + 데이터 페칭 + 비즈니스 로직
const NodeList = () => {
  const [nodes, setNodes] = useState([])

  useEffect(() => {
    fetch('/api/nodes').then(res => res.json()).then(setNodes)
  }, [])

  const filteredNodes = nodes.filter(n => !n.archived)

  return <ul>{filteredNodes.map(n => <li>{n.title}</li>)}</ul>
}

// Good: 책임 분리
// repo: 데이터 페칭
const useNodes = () => useQuery({ queryKey: ['nodes'], queryFn: fetchNodes })

// 컴포넌트: UI만
const NodeList = ({ nodes }: { nodes: Node[] }) => {
  return <ul>{nodes.map(n => <li key={n.id}>{n.title}</li>)}</ul>
}

// 페이지: 조합
const NodePage = () => {
  const { data: nodes } = useNodes()
  const activeNodes = nodes?.filter(n => !n.archived) ?? []
  return <NodeList nodes={activeNodes} />
}
```

## 모듈/파일

- 한 파일에 여러 책임이 섞이면 분리한다
- 예: `nodeUtils.ts`에 검증, 변환, 포맷팅이 섞여 있다면 → `nodeValidation.ts`, `nodeTransform.ts`, `nodeFormat.ts`
