# 상태 관리 패턴

## 핵심 원칙

**상태의 출처에 따라 도구를 구분한다.**

| 상태 종류 | 도구 | 예시 |
|-----------|------|------|
| 서버 상태 | React Query | 노드 목록, 워크스페이스 데이터, IPC 호출 결과 |
| UI 상태 | Zustand | 사이드바 열림/닫힘, 선택된 노드, 모달 상태 |

## 왜 구분하는가?

**서버 상태**
- 캐싱, 재검증, 로딩/에러 상태 관리가 필요
- React Query가 자동 처리

**UI 상태**
- 단순히 값을 저장하고 변경
- Zustand가 간단하고 빠름

## 예시

```tsx
// 서버 상태: React Query
const useNodes = () => {
  return useQuery({
    queryKey: ['nodes'],
    queryFn: () => window.api.getNodes()
  })
}

// UI 상태: Zustand
const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  selectedNodeId: null,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  selectNode: (id) => set({ selectedNodeId: id })
}))
```

## 안티패턴

```tsx
// Bad: 서버 데이터를 Zustand에 저장
const useStore = create((set) => ({
  nodes: [],
  fetchNodes: async () => {
    const nodes = await window.api.getNodes()
    set({ nodes }) // 캐시 불일치 발생
  }
}))

// Bad: UI 상태를 React Query로 관리
const useSidebarState = () => {
  return useQuery({
    queryKey: ['sidebar'],
    queryFn: () => true, // 불필요한 복잡성
    staleTime: Infinity
  })
}
```
