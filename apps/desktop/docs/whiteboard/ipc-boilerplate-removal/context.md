# IPC Boilerplate Removal - Context

## 목표
Electron IPC 보일러플레이트 제거: 한 곳에서 정의하면 채널, 핸들러, preload API가 자동으로 생성되도록

## 현재 상태 (AS-IS)

### 문제점
- 새 IPC 추가 시 3개 파일을 수동으로 수정해야 함:
  1. `src/common/channel.const.ts` - 채널 상수 추가
  2. `src/main/ipc/*.ts` - 핸들러 추가
  3. `src/preload/index.ts` - API 함수 추가
- 13개 채널 중 7개만 preload에 노출 (6개 누락)
- 타입 정보 분산으로 타입 안전성 부족
- 신규 개발자 진입 장벽

### 현재 구조
**채널 정의** (`channel.const.ts`):
```typescript
export const CHANNELS = {
  IS_INITIALIZED: '/app/is-initialized',
  GET_NODE: '/tree/node/get',
  // ... 13개 채널
} as const
```

**Main 핸들러** (예: `main/ipc/tree.ts`):
```typescript
ipcMain.handle(CHANNELS.GET_NODE, (_event, { nodeId }: { nodeId: string }) => {
  return NodeModel.getNodeById({ id: nodeId })
})
```

**Preload API** (`preload/index.ts`):
```typescript
const api = {
  // 수동으로 각 API 정의 (7개만 정의됨)
}
```

## 요구사항

### 기능 요구사항
1. 단일 진실 공급원 (Single Source of Truth)에서 IPC 정의
2. 채널명, 파라미터 타입, 리턴 타입을 한 번에 정의
3. preload API 자동 생성 또는 자동 등록
4. main 핸들러 등록 간소화
5. 전체 타입 안전성 보장

### 비기능 요구사항
1. 기존 13개 채널 마이그레이션 가능
2. 런타임 오버헤드 최소화
3. 디버깅 용이성 유지
4. Electron 보안 정책 준수 (contextIsolation)

## 설계 제약사항

### Electron IPC 제약사항
- contextIsolation=true 환경 (보안)
- 직렬화 가능한 데이터만 전달 가능
- preload는 Node.js + DOM 접근 가능
- renderer는 DOM만 접근 가능

### 프로젝트 아키텍처 규칙
- Main Process:
  - `common` → 외부 의존성 없음
  - `ipc` → `model`, `common` import 가능
- Renderer Process:
  - `repo` → IPC 통신 담당
  - `state` → React Query + Zustand

## 기존 13개 IPC 채널 목록

### App (4개)
1. `IS_INITIALIZED: '/app/is-initialized'`
   - Input: void
   - Output: Promise<boolean>

2. `SELECT_WORKSPACE_DIR_PATH: '/app/workspace/select-dir-path'`
   - Input: void
   - Output: Promise<string | null>

3. `INITIALIZE_APP: '/app/initialize'`
   - Input: string (workspaceDirPath)
   - Output: Promise<void>

4. `SYNC_APP: '/app/sync'`
   - Input: void
   - Output: Promise<void>

### Node/Tree (9개)
5. `GET_NODE_TABLE: '/nodes/table/get'`
   - Input: ? (미구현, handler 없음)
   - Output: ?

6. `GET_NODE: '/tree/node/get'`
   - Input: { nodeId: string }
   - Output: Promise<Node>

7. `GET_NODE_TITLE: '/nodes/title/get'`
   - Input: ? (handler 확인 필요)
   - Output: ?

8. `UPDATE_NODE_TITLE: '/nodes/title/update'`
   - Input: { nodeId: string; title: string }
   - Output: Promise<void>

9. `ADD_NEW_NODE_AFTER: '/view/tree/nodes/new/add-after'`
   - Input: { nodeId: string; title: string }
   - Output: Promise<?>

10. `GET_ROOT_NODE_ID: '/tree/root-node-id/get'`
    - Input: void
    - Output: Promise<string>

11. `GET_FAVORITES: '/favorites/get'`
    - Input: void
    - Output: Promise<Favorite[]>

12. `GET_VIEW_TREE_NODES: '/view/tree/nodes/get'`
    - Input: { topNodeId: string }
    - Output: Promise<TreeViewNode[]>

13. `REMOVE_NODE: '/view/tree/nodes/remove'`
    - Input: { nodeId: string }
    - Output: Promise<void>

## 참고 문서
- `/Users/gihyeonlee/workspace/voyl/apps/desktop/docs/project.md`
- `/Users/gihyeonlee/workspace/voyl/apps/desktop/docs/guide/layer/index.md`
- `/Users/gihyeonlee/workspace/voyl/apps/desktop/docs/guide/layer/main/index.md`

## 파일 위치
- 채널 정의: `/Users/gihyeonlee/workspace/voyl/apps/desktop/src/common/channel.const.ts`
- Main 핸들러:
  - `/Users/gihyeonlee/workspace/voyl/apps/desktop/src/main/ipc/app.ts`
  - `/Users/gihyeonlee/workspace/voyl/apps/desktop/src/main/ipc/tree.ts`
  - `/Users/gihyeonlee/workspace/voyl/apps/desktop/src/main/ipc/treeView.ts`
  - `/Users/gihyeonlee/workspace/voyl/apps/desktop/src/main/ipc/favorite.ts`
- Preload: `/Users/gihyeonlee/workspace/voyl/apps/desktop/src/preload/index.ts`
