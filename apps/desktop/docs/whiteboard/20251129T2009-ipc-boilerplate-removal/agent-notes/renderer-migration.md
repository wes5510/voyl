# Renderer IPC Migration - Agent Notes

## 작업 요약
IPC 보일러플레이트 제거 리팩토링에 따른 Renderer 코드 마이그레이션 완료.

## 변경된 파일

### 1. Preload 타입 정의
**파일**: `/apps/desktop/src/preload/index.d.ts`
- ElectronIPC 인터페이스 제거
- window.api 타입을 ChannelApi로 변경
- 타입 import 추가: `import type { ChannelApi } from '../common/channel.type'`

### 2. Renderer Repo 파일들

#### `/apps/desktop/src/renderer/repo/app.ts`
- 모든 window.api 메서드 호출을 새 채널명으로 변경
- 타입캐스팅 제거 (preload/index.d.ts에서 타입 제공)
- 채널명 변경:
  - `isInitialized()` → `window.api['app.isInitialized']()`
  - `selectWorkspaceDirPath()` → `window.api['app.selectWorkspaceDirPath']()`
  - `initializeApp(path)` → `window.api['app.initialize'](path)`
  - `syncApp()` → `window.api['app.sync']()`
- `loadApp()` 함수: deprecated 표시 (backend 핸들러 없음)

#### `/apps/desktop/src/renderer/repo/treeView.ts`
- CHANNELS import 제거
- window.electron.ipcRenderer.invoke() 호출 제거
- 채널명 변경:
  - `fetchTreeViewNodes()` → `window.api['tree.getViewNodes']()`
  - `addNewNodeAfter()` → `window.api['treeView.addNewNodeAfter']()`
  - `removeNode()` → `window.api['treeView.removeNode']()`

#### `/apps/desktop/src/renderer/repo/tree.ts`
- CHANNELS import 제거
- window.electron.ipcRenderer.invoke() 호출 제거
- 채널명 변경:
  - `fetchRootNodeId()` → `window.api['tree.getRootNodeId']()`
  - `fetchNode()` → `window.api['tree.getNode']()`
- 리턴 타입 수정: `Promise<NodeDTO | null>` (backend와 일치)

#### `/apps/desktop/src/renderer/repo/node.ts`
- CHANNELS import 제거
- window.electron.ipcRenderer.invoke() 호출 제거
- 채널명 변경:
  - `updateNodeTitle()` → `window.api['tree.updateNodeTitle']()`

#### `/apps/desktop/src/renderer/repo/favorite.ts`
- CHANNELS import 제거
- window.electron.ipcRenderer.invoke() 호출 제거
- 채널명 변경:
  - `fetchFavorites()` → `window.api['favorite.getAll']()`

## 채널명 매핑 (완료)

| 기존 (AS-IS) | 신규 (TO-BE) | 사용처 |
|-------------|-------------|--------|
| `isInitialized()` | `'app.isInitialized'` | app.ts |
| `selectWorkspaceDirPath()` | `'app.selectWorkspaceDirPath'` | app.ts |
| `initializeApp(path)` | `'app.initialize'` | app.ts |
| `loadApp()` | (없음 - deprecated) | app.ts |
| `syncApp()` | `'app.sync'` | app.ts |
| `CHANNELS.GET_ROOT_NODE_ID` | `'tree.getRootNodeId'` | tree.ts |
| `CHANNELS.GET_NODE` | `'tree.getNode'` | tree.ts |
| `CHANNELS.UPDATE_NODE_TITLE` | `'tree.updateNodeTitle'` | node.ts |
| `CHANNELS.GET_VIEW_TREE_NODES` | `'tree.getViewNodes'` | treeView.ts |
| `addNewNodeAfter()` | `'treeView.addNewNodeAfter'` | treeView.ts |
| `removeNode()` | `'treeView.removeNode'` | treeView.ts |
| `CHANNELS.GET_FAVORITES` | `'favorite.getAll'` | favorite.ts |

## 검증 결과

### 타입 체크
```bash
pnpm typecheck
```
✅ 모든 타입 에러 해결 완료

### 제거된 의존성
- ❌ `@/common/channel.const` import 제거 (모든 repo 파일)
- ❌ `window.electron.ipcRenderer` 직접 사용 제거
- ❌ 불필요한 타입캐스팅 제거

### 타입 안전성
- window.api는 ChannelApi 타입으로 추론됨
- 모든 채널명과 파라미터가 타입 체크됨
- 자동완성 지원

## 후속 작업 필요사항

1. `loadApp()` 핸들러 확인 및 제거 필요
   - 현재 deprecated로 표시
   - backend에 핸들러가 없음
   - 사용처 확인 후 완전히 제거해야 함

2. `/apps/desktop/src/common/channel.const.ts` 파일 삭제 고려
   - renderer에서는 더 이상 사용하지 않음
   - main에서 사용 여부 확인 필요

## 아키텍처 개선 효과

1. **단일 진실 공급원**: main/ipc/index.ts에서 모든 채널 정의
2. **타입 안전성**: ChannelApi로 전체 타입 보장
3. **보일러플레이트 제거**: CHANNELS 상수 및 타입캐스팅 불필요
4. **개발자 경험**: 자동완성 및 타입 추론 지원
