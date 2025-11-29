# main/ipc 구조

## 개요

IPC 모듈은 메인 프로세스와 렌더러 프로세스 간의 통신을 관리합니다.
**핵심**: 핸들러 정의에서 타입을 자동 추론하여 보일러플레이트를 제거합니다.

## 디렉토리 구조

```
ipc/
├── index.ts        # 핸들러 통합 + 타입 추출 + 자동 등록
├── app.ts          # 앱 관련 핸들러
├── tree.ts         # 트리 관련 핸들러
├── treeView.ts     # 트리뷰 관련 핸들러
├── favorite.ts     # 즐겨찾기 관련 핸들러
└── [domain].ts     # 기타 도메인별 핸들러
```

## 핸들러 정의 패턴

### 1. 도메인별 핸들러 파일 작성

각 도메인별로 핸들러 객체를 export합니다.

```typescript
// ipc/app.ts
export const appHandlers = {
  'app.sync': async (): Promise<void> => {
    return AppModel.sync()
  },
  'app.isInitialized': async (): Promise<boolean> => {
    return AppModel.isInitialized()
  },
  'app.initialize': async (workspaceDirPath: string): Promise<void> => {
    return AppModel.initializeApp({ workspaceDirPath })
  },
}
```

```typescript
// ipc/tree.ts
export const treeHandlers = {
  'tree.getRootNodeId': async (): Promise<string> => {
    return TreeModel.getRootNodeId()
  },
  'tree.getNode': async ({ nodeId }: { nodeId: string }): Promise<Node> => {
    return NodeModel.getNodeById({ id: nodeId })
  },
  'tree.updateNodeTitle': async ({
    nodeId,
    title
  }: {
    nodeId: string
    title: string
  }): Promise<void> => {
    return NodeModel.updateNodeTitle({ id: nodeId, title })
  },
}
```

### 2. 타입 추출 및 자동 등록 (index.ts)

```typescript
// ipc/index.ts
import { ipcMain } from 'electron'
import { appHandlers } from './app.js'
import { treeHandlers } from './tree.js'
import { treeViewHandlers } from './treeView.js'
import { favoriteHandlers } from './favorite.js'

// 모든 핸들러 통합
const handlers = {
  ...appHandlers,
  ...treeHandlers,
  ...treeViewHandlers,
  ...favoriteHandlers,
}

// 타입 자동 추출
export type ChannelApi = {
  [K in keyof typeof handlers]: typeof handlers[K]
}

// 자동 등록
export function registerHandlers(): void {
  Object.entries(handlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, (_, params) => handler(params))
  })
}
```

## 채널 네이밍 규칙

### Dot Notation
모든 채널명은 `domain.action` 형식을 따릅니다.

```typescript
// ✅ Good
'app.sync'
'app.isInitialized'
'tree.getNode'
'tree.updateNodeTitle'
'treeView.addNewNodeAfter'
'favorite.getFavorites'

// ❌ Bad
'/app/sync'
'APP_SYNC'
'getNode'
```

### 도메인별 그룹핑
- `app.*` - 앱 전역 기능 (초기화, 동기화)
- `tree.*` - 트리/노드 기본 CRUD
- `treeView.*` - 트리뷰 관련 UI 로직
- `favorite.*` - 즐겨찾기 관련
- `[domain].*` - 기타 도메인별 기능

## 타입 안전성

### 핸들러 타입 추론
핸들러 함수의 파라미터와 리턴 타입이 그대로 ChannelApi에 반영됩니다.

```typescript
// 핸들러 정의
export const handlers = {
  'tree.getNode': async ({ nodeId }: { nodeId: string }): Promise<Node> => {
    return NodeModel.getNodeById({ id: nodeId })
  },
}

// 자동 추론된 타입
type ChannelApi = {
  'tree.getNode': (params: { nodeId: string }) => Promise<Node>
}
```

### 렌더러에서 사용
preload 스크립트에서 ChannelApi 타입을 활용하여 타입 안전한 API를 제공합니다.

```typescript
// preload/index.ts
import type { ChannelApi } from '../main/ipc/index.js'

const api: ChannelApi = {
  'app.sync': () => ipcRenderer.invoke('app.sync'),
  'tree.getNode': (params) => ipcRenderer.invoke('tree.getNode', params),
  // ... 모든 채널에 대한 래퍼
}

contextBridge.exposeInMainWorld('api', api)
```

## 장점

### 1. 보일러플레이트 제거
- 채널 상수 정의 불필요
- 핸들러 등록 코드 자동화
- 1곳(핸들러 정의)만 수정하면 타입까지 자동 반영

### 2. 타입 안전성
- 핸들러 시그니처에서 타입 자동 추론
- 렌더러에서 타입 안전한 IPC 호출 가능
- 컴파일 타임에 타입 불일치 감지

### 3. 유지보수성
- 도메인별 파일 분리로 관심사 분리
- 채널명 규칙으로 일관성 유지
- 새 핸들러 추가 시 기존 코드 수정 최소화

## Import 규칙

- `model`, `common`만 import 가능
- 다른 ipc 핸들러 파일 import 금지
- 각 핸들러는 독립적으로 동작

## 예시: 새 핸들러 추가하기

### 1. 핸들러 정의
```typescript
// ipc/workspace.ts
export const workspaceHandlers = {
  'workspace.getSettings': async (): Promise<WorkspaceSettings> => {
    return WorkspaceModel.getSettings()
  },
  'workspace.updateSettings': async (
    settings: Partial<WorkspaceSettings>
  ): Promise<void> => {
    return WorkspaceModel.updateSettings(settings)
  },
}
```

### 2. index.ts에 추가
```typescript
// ipc/index.ts
import { workspaceHandlers } from './workspace.js'

const handlers = {
  ...appHandlers,
  ...treeHandlers,
  ...workspaceHandlers, // 추가
}
```

### 3. 끝
타입은 자동으로 추론되고, 핸들러는 자동으로 등록됩니다.
