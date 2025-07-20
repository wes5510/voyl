# 트리 조회 React Query 마이그레이션 계획 (TDD 포함)

**기반 문서**: 2025-07-13-treeview-implementation-plan.md  
**작성일**: 2025-07-20  
**상태**: 계획 완료, 구현 대기

## 문제 정의

트리 조회 로직을 Zustand에서 React Query로 마이그레이션하여 서버 상태와 UI 상태를 분리. 현재 `flattenedTree.nodes`는 백엔드에서 가져와야 하므로 불필요한 중복 제거.

## 목표 및 Non-Goal

**목표**: 트리 조회만 React Query로 마이그레이션  
**Non-Goal**: 노드 수정, 트리 수정(순서 변경), 노드 추가, Prefetch 최적화

## 전체 전략

- 부분 문제 분해: 7단계로 쪼개 독립 처리 후 통합
- TDD 접근: 백엔드 비즈니스 로직은 테스트 우선 개발
- 의존성: TypeScript 오류 해결 → 백엔드 API → 프론트엔드
- 테스트: Vitest로 백엔드 로직, React Query Devtools로 캐싱 확인
- 주의: treeView와 tree store 완전 분리, view 우선 IPC 구조

## 작업 범위

### 작업 대상 파일들

- `apps/desktop/src/renderer/store/treeView/` (React Query 추가 + Zustand 단순화)
- `apps/desktop/src/renderer/pages/nodes/MainPanel/TreeView/` (컴포넌트 수정)
- `apps/desktop/src/main/` (백엔드 API 추가 + 테스트)
- `apps/desktop/src/renderer/repos/treeView.ts` (새 파일 - API 함수 추가)

### 참고만 할 파일들

- `apps/desktop/src/renderer/__models/`, `__pages/`, `__common/` (마이그레이션 전)

## 단계별 구현 계획

### 1. TypeScript 오류 해결 (즉시)

**목적**: 컴파일 오류 해결, prefetch 로직 제거 (non-goal)

**대상 파일**:

- `ExpandButton.tsx`
- `TreeViewItemInput/index.tsx`

**변경사항**:

```typescript
// Before (오류)
import { useTreeNodeDetailed, usePrefetchTreeNodes } from '@/renderer/store/tree'
const node = useTreeNodeDetailed({ nodeId })
const prefetchTreeNodes = usePrefetchTreeNodes()

// After (수정)
import { useTreeNode } from '@/renderer/store/tree'
const node = useTreeNode({ nodeId })
// prefetch 관련 코드 모두 제거
```

### 2. TreeViewStore 구조 단순화

**목적**: 불필요한 중복 제거, 개념 분리 명확화

**대상 파일**: `apps/desktop/src/renderer/store/treeView/index.ts`

**현재 (불필요한 중복)**:

```typescript
entity: {
  flattenedTree: {
    nodes: [],           // ❌ 제거 - 백엔드에서 가져옴
    expandedNodeIds: [], // ✅ 유지 - UI 상태
    rootNodeId: 'n-1',   // ❌ 제거 - 개념상 다름
  },
  topNodeId: undefined,
  focusedNodeId: undefined,
  draggingNode: undefined,
}
```

**변경 후 (단순화)**:

```typescript
entity: {
  expandedNodeIds: [],     // UI 상태 관리
  topNodeId: undefined,    // 화면상 최상위 노드
  focusedNodeId: undefined,
  draggingNode: undefined,
}
```

**개념 정리**:

- **`rootNodeId`**: 전체 트리의 절대적 루트 → `useRootNodeId()` 훅 사용 (이미 존재)
- **`topNodeId`**: 현재 화면의 상대적 최상단 → `useTopNodeId()` 훅 사용 (이미 설정됨)

### 3. 백엔드 트리 구조 조회 API 구현 (TDD 접근)

**목적**: 확장된 노드들만 포함한 평면화된 트리 구조 제공

**🎯 작업 전략**:

1. **인프라 설정 먼저** (3-1 ~ 3-3): 채널, IPC, 모델 확장
2. **TDD에 집중** (3-4 ~ 3-5): Red → Green → Refactor

#### 3-1. 새 채널 추가

**파일**: `apps/desktop/src/common/channel.const.ts`

```typescript
export const CHANNELS = {
  GET_VIEW_TREE_NODES: '/view/tree/nodes/get', // view > tree > nodes 계층
} as const
```

#### 3-2. IPC 핸들러

**파일**: `apps/desktop/src/main/ipc/tree.ts`

```typescript
import { getTreeViewNodes } from '../models/treeView'

ipcMain.handle(CHANNELS.GET_VIEW_TREE_NODES, (_, { topNodeId }: { topNodeId: string }) => {
  return getTreeViewNodes({ topNodeId })
})
```

#### 3-3. tree core 모델 확장

**파일**: `apps/desktop/src/main/models/tree/index.ts` (기존 파일 확장)

**추가할 함수** (기존 패턴에 맞게 wrapper 함수):

```typescript
export async function getChildNodeIds({ parentId }: { parentId: string }): Promise<string[]> {
  if (parentId === '') {
    throw new Error('Parent ID cannot be empty string')
  }

  const childIds = await db.getChildIds({ parentId })
  return childIds
}

export async function getNodeIndex({ nodeId }: { nodeId: string }): Promise<string | undefined> {
  if (nodeId === '') {
    throw new Error('Node ID cannot be empty string')
  }

  const index = await db.getNodeIndexById({ id: nodeId })
  return index
}
```

#### 3-4. 🔴 TDD: 테스트 케이스 정의 (Red Phase)

**파일**: `apps/desktop/src/main/models/treeView/index.test.ts` (새 파일)

**테스트 시나리오**:

- 단순한 1레벨 트리 (자식 없음, 확장/축소 상태)
- 깊은 트리 구조 (여러 레벨, 중간 축소)
- index 필드 정렬 (사전적 순서, 누락 처리)

**Mock 설정**:

```typescript
vi.mock('../tree/index.js', () => ({
  getChildNodeIds: vi.fn(),
  getNodeIndex: vi.fn(),
}))
```

#### 3-5. 🟢 TDD: 비즈니스 로직 구현 (Green → Refactor Phase)

**파일**: `apps/desktop/src/main/models/treeView/index.ts` (새 파일)

**의존성**:

```typescript
// tree core 모델만 의존
import { getChildNodeIds, getNodeIndex } from '../tree'
```

**핵심 기능**:

- 재귀적 트리 구조 생성
- 하드코딩된 `expandedNodeIds` 사용 (프로토타이핑)
- `index` 필드로 사전적 정렬 (abcd...)
- depth 계산

**반환 타입**:

```typescript
export type TreeViewItem = {
  nodeId: string
  depth: number
}
```

**TDD 프로세스**:

1. **Red**: 테스트 실행 → 실패 확인
2. **Green**: 최소 구현으로 테스트 통과
3. **Refactor**: 코드 개선 및 기능 완성

**테스트**: `npm run test src/main/models/treeView/index.test.ts`

### 4. treeView 전용 React Query 구현

**목적**: tree store와 완전 분리된 treeView 전용 React Query 관리

#### 4-1. 파일 구조

```
apps/desktop/src/renderer/store/treeView/
├── index.ts          // 기존 Zustand + 새 React Query 훅
├── queryOptions.ts   // 새 파일 - treeView 전용
└── queryKeys.ts      // 새 파일 - treeView 전용
```

#### 4-2. 쿼리 키 (새 파일)

**파일**: `apps/desktop/src/renderer/store/treeView/queryKeys.ts`

```typescript
export const TREE_VIEW_QUERY_KEYS = {
  all: ['treeView'] as const,
  nodes: ({ topNodeId }: { topNodeId: string }) =>
    [...TREE_VIEW_QUERY_KEYS.all, 'nodes', topNodeId] as const,
}
```

#### 4-3. 쿼리 옵션 (새 파일)

**파일**: `apps/desktop/src/renderer/store/treeView/queryOptions.ts`

```typescript
import { fetchTreeViewNodes } from '@/renderer/repos/treeView'
import { TREE_VIEW_QUERY_KEYS } from './queryKeys'

export const getTreeViewNodesQueryOptions = ({ topNodeId }: { topNodeId: string }) => ({
  queryKey: TREE_VIEW_QUERY_KEYS.nodes({ topNodeId }),
  queryFn: () => fetchTreeViewNodes({ topNodeId }),
  staleTime: 30 * 60 * 1000, // 30분
})
```

#### 4-4. API 함수

**파일**: `apps/desktop/src/renderer/repos/treeView.ts` (새 파일)

```typescript
export const fetchTreeViewNodes = async ({
  topNodeId,
}: {
  topNodeId: string
}): Promise<TreeViewItem[]> => {
  return window.electron.ipcRenderer.invoke(CHANNELS.GET_VIEW_TREE_NODES, { topNodeId })
}
```

#### 4-5. treeView store 확장

**파일**: `apps/desktop/src/renderer/store/treeView/index.ts` (기존 파일 확장)

**새로 추가**:

```typescript
// React Query 훅
export const useTreeViewNodes = ({ topNodeId }: { topNodeId: string }) => {
  const { data } = useSuspenseQuery(getTreeViewNodesQueryOptions({ topNodeId }))
  return data
}
```

### 5. TreeView 컴포넌트 마이그레이션

**목적**: Zustand 기반에서 React Query + Zustand 조합으로 전환

**파일**: `apps/desktop/src/renderer/pages/nodes/MainPanel/TreeView/index.tsx`

**변경 후 (매우 단순해짐)**:

```typescript
import { useTreeViewNodes, useTopNodeId } from '@/renderer/store/treeView'

// 이미 설정된 topNodeId 사용 (useSetTreeViewTopNode에서 설정함)
const topNodeId = useTopNodeId()

// treeView store에서 트리 구조 조회
const treeViewNodes = useTreeViewNodes({ topNodeId })

// UI 상태들 (Zustand)
const { expandedNodeIds, draggingNode, focusedNodeId } = useTreeViewStore(...)
```

### 6. 상태 관리 역할 분담

**React Query 역할** (in treeView store):

- 트리 구조 데이터 (`TreeViewItem[]`)

**Zustand 역할** (in treeView store):

- UI 상태 (`expandedNodeIds`, `focusedNodeId`, `draggingNode`)
- 화면 상태 (`topNodeId`)

**별도 관리** (in tree store):

- 개별 노드 데이터 (`useTreeNode`)
- 절대적 루트 (`useRootNodeId`)

### 7. 드래그앤드롭 기능 유지

**Non-Goal 처리**:

- `draggingNode` 상태 관리 **유지**
- `handleDragEnd`, `handleDragMove`, `handleDragStart` **유지**
- `moveToChildNode` 등 트리 수정 로직 **그대로 유지**
- 조회 로직만 React Query로 마이그레이션

## 구현 순서

1. **TypeScript 오류 해결** (즉시)
2. **TreeViewStore 단순화**
3. **백엔드 API 구현 (TDD)**
   - 인프라 설정: 채널, IPC, tree core 모델 확장
   - 🔴 Red: 테스트 케이스 작성
   - 🟢 Green: 최소 구현으로 테스트 통과
   - 🔵 Refactor: 코드 개선 및 기능 완성
4. **treeView 전용 React Query 구현**
5. **TreeView 컴포넌트 마이그레이션**
6. **상태 관리 역할 분담**
7. **최종 테스트 및 정리**

## 테스트 전략

### TDD 테스트 (백엔드)

```bash
# 백엔드 테스트 실행
cd apps/desktop
npm run test src/main/models/treeView/index.test.ts
```

**테스트 커버리지**:

- 단순한 1레벨 트리
- 깊은 트리 구조
- index 필드 정렬
- 확장/축소 상태 처리

### React Query 테스트 (프론트엔드)

- React Query Devtools로 캐시 히트 확인
- staleTime 30분 설정 검증

## 최종 아키텍처

### 파일 구조 분리

```
store/
├── tree/              # 노드 데이터 (개별 노드, 루트)
│   ├── index.ts       # useRootNodeId, useTreeNode
│   ├── queryOptions.ts
│   └── queryKeys.ts
└── treeView/          # 트리뷰 (구조 + UI 상태)
    ├── index.ts       # useTreeViewNodes + Zustand
    ├── queryOptions.ts # 새 파일
    └── queryKeys.ts   # 새 파일

repos/
├── tree.ts            # tree core API 함수
└── treeView.ts        # treeView extension API 함수 (새 파일)

main/models/
├── tree/              # tree core (기존)
└── treeView/          # treeView extension (새 폴더)
    ├── index.ts       # 비즈니스 로직
    └── index.test.ts  # TDD 테스트
```

### 데이터 흐름

```
useSetTreeViewTopNode() (pages/nodes/index.tsx)
  ↓
useTopNodeId() (treeView store)
  ↓
useTreeViewNodes({ topNodeId }) (treeView store - React Query)
  ↓
TreeView Component ← expandedNodeIds (treeView store - Zustand)
```

### 역할 분담

- **tree store**: 개별 노드 데이터, 루트 노드
- **treeView store**: 트리 구조 + UI 상태 통합 관리
- **pages**: 초기 설정 (`useSetTreeViewTopNode`)

## Before/After 비교

| 구분                | Before (Zustand만)              | After (RQ + Zustand)                 |
| ------------------- | ------------------------------- | ------------------------------------ |
| **트리 구조**       | `flattenedTree.nodes`           | `useTreeViewNodes({ topNodeId })` ✅ |
| **화면 최상단**     | `topNodeId`                     | `useTopNodeId()` (유지)              |
| **확장 상태**       | `flattenedTree.expandedNodeIds` | `expandedNodeIds` ✅                 |
| **테스트 커버리지** | ❌ 없음                         | ✅ **TDD로 100% 커버**               |

## 핵심 설계 원칙

1. **개념적 분리**: tree ↔ treeView 코드 섞임 금지
2. **TDD 접근**: 백엔드 로직의 안전한 구현과 리팩토링
3. **단순한 사용**: `useTopNodeId()` 만으로 충분
4. **확장 가능**: `/view/tree/nodes` 구조 (캘린더, 칸반 뷰 대비)
5. **점진적 개선**: 하드코딩 → localStorage → DB
6. **Non-Goal 준수**: 조회만 마이그레이션

## TDD 핵심 가치

1. **안전한 리팩토링**: 테스트 보장 하에 코드 개선
2. **명확한 요구사항**: 테스트 케이스가 곧 스펙
3. **빠른 피드백**: 구현 중 즉시 동작 확인
4. **회귀 방지**: 향후 변경 시 기존 기능 보호
5. **문서화 효과**: 테스트 케이스가 사용법 가이드

## 리스크 및 주의사항

- **하드코딩 제한**: 프로토타이핑 목적, 향후 DB 연동 필요
- **캐시 무효화**: 현재 제외, 노드 수정 시 별도 구현 필요
- **Non-Goal 엄수**: 트리 수정 로직 건드리지 않음
- **treeView 분리**: tree store와 혼재하지 않도록 주의

**상태**: 계획 완료, TDD 구현 대기

---

**작성일**: 2025-07-20  
**검토자**: -  
**승인일**: -
