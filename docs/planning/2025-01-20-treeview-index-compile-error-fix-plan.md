# treeView/index.ts 컴파일 오류 해결 계획 (최종 확정)

**작성일**: 2025-01-20  
**모드**: PLAN  
**대상 파일**: `apps/desktop/src/renderer/models/treeView/index.ts`

## 문제 정의

TreeViewEntity 구조 단순화 후 `entity.flattenedTree` 접근으로 인한 **20개의 컴파일 오류** 발생.
**실제 사용 현황 철저 분석** 결과, 거의 모든 함수가 죽은 코드임을 확인.

## 📊 실제 사용 현황 최종 분석

### ✅ 실제 사용되는 것들 (1개 함수 + 1개 타입)

1. **`setTopNodeId` 함수** → `store/treeView/index.ts`에서 사용

   ```typescript
   // store에서 사용됨
   entity: setTopNodeId({ entity: prev.entity, topNodeId })
   ```

2. **`TreeViewEntity` 타입** → 타입 정의로만 사용
   ```typescript
   // store의 interface에서 사용됨
   entity: TreeViewEntity
   ```

### ❌ 사용되지 않는 함수들 (19개) - **완전 삭제**

#### 🗑️ 구버전에서만 사용 (실제 사용 X)

```typescript
- getTreeViewNodes       ❌ (__pages에서만 사용)
- isExpandedNode         ❌ (__pages에서만 사용)
- getDraggingNode        ❌ (__pages에서만 사용)
- toggleExpandedNode     ❌ (__pages에서만 사용)
- getNodeDepth           ❌ (DraggingTreeviewItem 사용되지 않음)
```

#### 🗑️ 완전히 사용되지 않음

```typescript
;-setFocusedNodeId,
  isFocus - setFocusToPrevNode,
  setFocusToNextNode,
  setFocusForRemovedNode - __getPrevNodeId,
  __getNextNodeId,
  __hasPrevNode - expandNode,
  getDraggingNodeParentId,
  getCountChildBetweenNodes - moveDraggingNode,
  setDraggingNode,
  resetDraggingNode
```

### 🧹 사용되지 않는 Import들 - **완전 삭제**

```typescript
// 거의 모든 import 삭제 가능
;-FlattenedTreeEntity,
  FlattenedTreeNode,
  NodeTable - initFlattenedTree,
  isExpanded,
  toggleExpanded,
  expand,
  collapse - getChildNodeIds,
  getFlattenedTreeNode,
  getParentNodeId - getPrevNode,
  getRootNodeId,
  moveNode,
  sliceFlattenedTree - setDraggingNodeByNodeId,
  moveDraggingNodeByDeltaDepthAndOverNodeId
```

## 🎯 극도로 단순한 해결 방안

### Phase 1: **대량 삭제** (19개 함수 + 모든 import)

- **모든 함수 삭제** (setTopNodeId 제외)
- **거의 모든 import 삭제**

### Phase 2: **최소한만 유지**

```typescript
// 단 20줄 정도만 남김
import { DraggingNodeEntity } from './draggingNode'

export interface TreeViewEntity {
  expandedNodeIds: string[]
  focusedNodeId?: string
  draggingNode?: DraggingNodeEntity
  topNodeId?: string
}

export const setTopNodeId = ({
  entity,
  topNodeId,
}: {
  entity: TreeViewEntity
  topNodeId: string
}): TreeViewEntity => {
  return {
    ...entity,
    topNodeId,
  }
}
```

## 📊 Before/After 극단적 변화

| 구분            | Before | After     | 변화량                |
| --------------- | ------ | --------- | --------------------- |
| **전체 함수**   | 20개   | **1개**   | **-19개 (95% 감소)**  |
| **Import 줄**   | ~20줄  | **1줄**   | **-19줄**             |
| **파일 크기**   | 337줄  | **~20줄** | **-317줄 (94% 감소)** |
| **컴파일 오류** | 20개   | **0개**   | **완전 해결**         |

## 🚀 작업 순서

### Step 1: **모든 함수 삭제** (19개)

```typescript
// 이 모든 함수들을 삭제
export const getTreeViewNodes = ...      ❌
export const setFocusedNodeId = ...      ❌
export const isFocus = ...               ❌
export const setFocusToPrevNode = ...    ❌
export const setFocusToNextNode = ...    ❌
export const setFocusForRemovedNode = ... ❌
const __getPrevNodeId = ...              ❌
const __getNextNodeId = ...              ❌
const __hasPrevNode = ...                ❌
export const toggleExpandedNode = ...    ❌
export const expandNode = ...            ❌
export const isExpandedNode = ...        ❌
export const getDraggingNode = ...       ❌
export const setDraggingNode = ...       ❌
export const moveDraggingNode = ...      ❌
export const getNodeDepth = ...          ❌
export const getDraggingNodeParentId = ... ❌
export const getCountChildBetweenNodes = ... ❌
export const resetDraggingNode = ...     ❌
```

### Step 2: **Import 대량 삭제**

```typescript
// 이 모든 import 삭제
import {
  DraggingNodeEntity,                    ✅ 유지
  setDraggingNodeByNodeId,               ❌ 삭제
  moveDraggingNodeByDeltaDepthAndOverNodeId, ❌ 삭제
} from './draggingNode'
import {
  collapse,                              ❌ 삭제
  expand,                                ❌ 삭제
  FlattenedTreeEntity,                   ❌ 삭제
  FlattenedTreeNode,                     ❌ 삭제
  getChildNodeIds,                       ❌ 삭제
  getFlattenedTreeNode,                  ❌ 삭제
  getParentNodeId,                       ❌ 삭제
  getPrevNode,                           ❌ 삭제
  getRootNodeId,                         ❌ 삭제
  initFlattenedTree,                     ❌ 삭제
  isExpanded,                            ❌ 삭제
  moveNode,                              ❌ 삭제
  NodeTable,                             ❌ 삭제
  sliceFlattenedTree,                    ❌ 삭제
  toggleExpanded,                        ❌ 삭제
} from './flattenedTree'
```

### Step 3: **최종 파일 완성**

```typescript
import { DraggingNodeEntity } from './draggingNode'

export interface TreeViewEntity {
  expandedNodeIds: string[]
  focusedNodeId?: string
  draggingNode?: DraggingNodeEntity
  topNodeId?: string
}

export const setTopNodeId = ({
  entity,
  topNodeId,
}: {
  entity: TreeViewEntity
  topNodeId: string
}): TreeViewEntity => {
  return {
    ...entity,
    topNodeId,
  }
}
```

## ✅ 성공 기준

1. **컴파일 오류 0개** - 모든 TypeScript 오류 해결 ✅
2. **기능 유지** - setTopNodeId와 TreeViewEntity 정상 동작 ✅
3. **극도 단순화** - 337줄 → 20줄 (94% 감소) ✅
4. **죽은 코드 제거** - 19개 함수 완전 삭제 ✅

## 🚨 리스크 및 주의사항

### ⚠️ 예상 리스크

**없음** - 실제로 사용되는 코드만 남기므로 안전

### 🛡️ 완화 방안

1. **참고 가능성**: 삭제된 코드는 `__models/` 디렉토리나 git history에서 참조 가능
2. **점진적 복구**: 향후 필요 시 git에서 복구 후 새 구조에 맞게 재구현

## 💡 핵심 가치

1. **극도의 단순함**: 20줄로 모든 문제 해결
2. **죽은 코드 0개**: 실사용 기준 정리
3. **Non-Goal 준수**: 조회 로직만 정리, 기능 변경 없음
4. **유지보수성**: 향후 React Query 도입 시 깔끔한 시작점

---

**계획 완료**: 95% 코드 삭제를 통한 극도의 단순화  
**상태**: 검토 완료, 실행 대기

**작성일**: 2025-01-20  
**검토자**: -  
**승인일**: -
