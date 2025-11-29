# 상태 관리 패턴

## 핵심 원칙

**상태의 출처에 따라 도구를 구분한다.**

| 상태 종류 | 도구 | 예시 |
|-----------|------|------|
| 서버 상태 | React Query | 노드 목록, 워크스페이스 데이터, IPC 호출 결과 |
| UI 상태 | Valtio | 사이드바 열림/닫힘, 선택된 노드, 모달 상태 |

## 왜 구분하는가?

**서버 상태**
- 캐싱, 재검증, 로딩/에러 상태 관리가 필요
- React Query가 자동 처리

**UI 상태**
- 단순히 값을 저장하고 변경
- Valtio가 간단하고 자동 추적 (proxy 기반)

## 예시

```tsx
// 서버 상태: React Query
const useNodes = () => {
  return useQuery({
    queryKey: ['nodes'],
    queryFn: () => window.api.getNodes()
  })
}

// UI 상태: Valtio
import { proxy, useSnapshot } from 'valtio'

const uiState = proxy({
  sidebarOpen: true,
  selectedNodeId: null as string | null,
})

// Actions (별도 함수)
export const toggleSidebar = () => {
  uiState.sidebarOpen = !uiState.sidebarOpen
}

export const selectNode = (id: string) => {
  uiState.selectedNodeId = id
}

// Hook
export const useSidebarOpen = () => {
  const snap = useSnapshot(uiState)
  return snap.sidebarOpen
}
```

## 안티패턴

```tsx
// Bad: 서버 데이터를 Valtio에 저장
const state = proxy({ nodes: [] })
const fetchNodes = async () => {
  const nodes = await window.api.getNodes()
  state.nodes = nodes // 캐시 불일치 발생
}

// Bad: UI 상태를 React Query로 관리
const useSidebarState = () => {
  return useQuery({
    queryKey: ['sidebar'],
    queryFn: () => true, // 불필요한 복잡성
    staleTime: Infinity
  })
}
```
