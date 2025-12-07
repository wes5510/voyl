# IPC 보일러플레이트 제거 계획

**작성일**: 2025-11-29
**작성자**: Planner Agent

## 작업 목표

Electron IPC 구조를 타입 추론 기반으로 개선하여 보일러플레이트를 제거하고 단일 수정 지점(Single Source of Truth)을 확보합니다.

### 핵심 원칙
- **핸들러 정의에서 타입 추론**: 별도 스키마 정의 불필요
- **1곳만 수정**: 핸들러 추가/수정 시 타입이 자동 반영
- **Proxy 기반 API**: 런타임 채널 매핑 자동화

## 현재 구조 분석

### 파일 현황

**Main Process (핸들러 정의)**:
- `main/ipc/app.ts` - 4개 핸들러 (isInitialized, selectWorkspaceDirPath, initializeApp, syncApp)
- `main/ipc/tree.ts` - 4개 핸들러 (getRootNodeId, getNode, getViewTreeNodes, updateNodeTitle)
- `main/ipc/favorite.ts` - 1개 핸들러 (getFavorites)
- `main/ipc/treeView.ts` - 2개 핸들러 (addNewNodeAfter, removeNode)
- `main/ipc/index.ts` - 핸들러 등록 (11개 총)

**공통 레이어**:
- `common/channel.const.ts` - CHANNELS 상수 객체 (17개 채널 정의) ⚠️ 삭제 대상

**Preload**:
- `preload/index.ts` - 수동 API 정의 (6개만 정의됨) ⚠️ 교체 대상
- `preload/index.d.ts` - 수동 타입 정의 ⚠️ 삭제 대상

**Renderer (사용처)**:
- `renderer/repo/app.ts` - window.api 사용 (5개 함수)
- `renderer/repo/tree.ts` - window.electron.ipcRenderer 직접 사용 (3개)
- `renderer/repo/node.ts` - window.electron.ipcRenderer 직접 사용 (1개)
- `renderer/repo/favorite.ts` - window.electron.ipcRenderer 직접 사용 (1개)
- `renderer/repo/treeView.ts` - 혼합 사용 (1개 직접, 2개 window.api)

### 문제점

1. **중복 정의**: 채널 이름을 3곳에서 정의 (CHANNELS, preload api, 타입)
2. **불완전한 커버리지**: preload api는 6개만 정의, 나머지 5개는 직접 호출
3. **타입 불일치 위험**: 핸들러 시그니처와 preload 타입이 따로 관리됨
4. **수동 유지보수**: 핸들러 추가 시 4곳 수정 필요

## 목표 구조

### 디렉토리 구조
```
main/ipc/
├── app.ts        - appHandlers 객체 export
├── tree.ts       - treeHandlers 객체 export
├── favorite.ts   - favoriteHandlers 객체 export
├── treeView.ts   - treeViewHandlers 객체 export
└── index.ts      - 합치기 + 타입 추출 + 자동 등록

common/
└── channel.type.ts - ChannelApi 타입만 re-export (renderer import용)

preload/
└── index.ts      - Proxy 기반 API 자동 생성
```

### 삭제될 파일
- `common/channel.const.ts` (CHANNELS 상수)
- `preload/index.d.ts` (수동 타입 정의)

### 핸들러 정의 방식

**Before (현재)**:
```typescript
// main/ipc/app.ts
export default function registerAppHandlers(ipcMain: Electron.IpcMain): void {
  ipcMain.handle(CHANNELS.IS_INITIALIZED, async (): Promise<boolean> => {
    return await AppModel.isInitialized()
  })
  // ...
}
```

**After (목표)**:
```typescript
// main/ipc/app.ts
export const appHandlers = {
  'app.isInitialized': async (): Promise<boolean> => {
    return await AppModel.isInitialized()
  },
  'app.selectWorkspaceDirPath': async (): Promise<string | null> => {
    const window = BrowserWindow.fromWebContents(event.sender)
    const result = await dialog.showOpenDialog(window!, {
      properties: ['openDirectory', 'createDirectory'],
      title: 'Select Workspace Location',
      buttonLabel: 'Select',
      defaultPath: join(homedir(), 'Documents'),
    })
    return result.canceled ? null : result.filePaths[0]
  },
  'app.initializeApp': async ({ workspaceDirPath }: { workspaceDirPath: string }): Promise<void> => {
    await AppModel.initializeApp({ workspaceDirPath })
  },
  'app.syncApp': async (): Promise<void> => {
    await AppModel.sync()
  },
}
```

### 타입 추출 및 등록

```typescript
// main/ipc/index.ts
import { IpcMain } from 'electron'
import { appHandlers } from './app.js'
import { treeHandlers } from './tree.js'
import { favoriteHandlers } from './favorite.js'
import { treeViewHandlers } from './treeView.js'

const handlers = {
  ...appHandlers,
  ...treeHandlers,
  ...favoriteHandlers,
  ...treeViewHandlers,
}

// 타입 추출
export type Handlers = typeof handlers

export type ChannelApi = {
  [K in keyof Handlers]: (
    params: Parameters<Handlers[K]>[0]
  ) => ReturnType<Handlers[K]>
}

// 자동 등록
export function registerHandlers(ipcMain: IpcMain): void {
  Object.entries(handlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, (_, params) => handler(params))
  })
}
```

### Preload Proxy

```typescript
// preload/index.ts
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { ChannelApi } from '../common/channel.type.js'

const api = new Proxy({} as ChannelApi, {
  get(_, channel: string) {
    return (params: unknown) => ipcRenderer.invoke(channel, params)
  }
})

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('api', api)
} else {
  // @ts-expect-error
  window.electron = electronAPI
  // @ts-expect-error
  window.api = api
}
```

### 공통 타입 파일

```typescript
// common/channel.type.ts
export type { ChannelApi } from '../main/ipc/index.js'
```

### Global 타입 정의

```typescript
// preload/index.d.ts (새 내용으로 교체)
import { ElectronAPI } from '@electron-toolkit/preload'
import type { ChannelApi } from '../common/channel.type'

declare global {
  interface Window {
    electron: ElectronAPI
    api: ChannelApi
  }
}
```

## 영향 범위

### Main Process
- ✅ `main/ipc/app.ts` - 함수 → 객체 변환
- ✅ `main/ipc/tree.ts` - 함수 → 객체 변환
- ✅ `main/ipc/favorite.ts` - 함수 → 객체 변환
- ✅ `main/ipc/treeView.ts` - 함수 → 객체 변환
- ✅ `main/ipc/index.ts` - 타입 추출 + 자동 등록 로직
- ✅ `main/index.ts` - registerHandlers() 호출 방식 변경

### Common Layer
- ❌ `common/channel.const.ts` - 삭제
- ✅ `common/channel.type.ts` - 새로 생성 (타입만 re-export)

### Preload
- ✅ `preload/index.ts` - Proxy 기반으로 전면 교체
- ✅ `preload/index.d.ts` - 타입 import 방식으로 교체

### Renderer (사용처)
- ✅ `renderer/repo/app.ts` - 채널 이름 변경 (window.api 유지)
- ✅ `renderer/repo/tree.ts` - window.api로 변경
- ✅ `renderer/repo/node.ts` - window.api로 변경
- ✅ `renderer/repo/favorite.ts` - window.api로 변경
- ✅ `renderer/repo/treeView.ts` - window.api로 통일

## 실행 계획

### Phase 1: Main Process 핸들러 구조 변경
**담당**: Architect Agent
**작업**:
1. `main/ipc/app.ts` - appHandlers 객체로 변환
2. `main/ipc/tree.ts` - treeHandlers 객체로 변환
3. `main/ipc/favorite.ts` - favoriteHandlers 객체로 변환
4. `main/ipc/treeView.ts` - treeViewHandlers 객체로 변환
5. `main/ipc/index.ts` - 타입 추출 + registerHandlers() 구현

**산출물**:
- 수정된 핸들러 파일 4개
- 타입 추출 및 등록 로직

### Phase 2: Common Layer 타입 파일 생성
**담당**: Architect Agent
**작업**:
1. `common/channel.type.ts` 생성 - ChannelApi re-export

**산출물**:
- 새 타입 파일

### Phase 3: Preload Layer 전면 교체
**담당**: Architect Agent
**작업**:
1. `preload/index.ts` - Proxy 기반 api 구현
2. `preload/index.d.ts` - 타입 import 방식으로 교체

**산출물**:
- Proxy 기반 preload 구현
- 타입 정의 파일

### Phase 4: Main Entry 수정
**담당**: Architect Agent
**작업**:
1. `main/index.ts` - registerHandlers() 호출 방식 변경

**산출물**:
- 수정된 main entry

### Phase 5: Renderer 사용처 마이그레이션
**담당**: Architect Agent
**작업**:
1. `renderer/repo/app.ts` - 채널 이름 변경
2. `renderer/repo/tree.ts` - window.api 사용으로 변경
3. `renderer/repo/node.ts` - window.api 사용으로 변경
4. `renderer/repo/favorite.ts` - window.api 사용으로 변경
5. `renderer/repo/treeView.ts` - window.api로 통일

**산출물**:
- 수정된 repo 파일 5개

### Phase 6: 레거시 파일 삭제
**담당**: Architect Agent
**작업**:
1. `common/channel.const.ts` 삭제

**산출물**:
- 삭제 완료

### Phase 7: 통합 테스트
**담당**: Tester Agent (또는 수동)
**작업**:
1. 앱 실행 확인
2. 모든 IPC 통신 동작 확인
3. 타입 체크 통과 확인

**산출물**:
- 테스트 보고서

## Agent 할당

### 순차 실행
1. **Architect Agent**: Phase 1-6 전체 구현
2. **Tester Agent**: Phase 7 검증

## 채널 이름 매핑

### 기존 → 신규

| 기존 채널 이름 | 신규 채널 이름 | 핸들러 위치 |
|---|---|---|
| `/app/is-initialized` | `app.isInitialized` | app.ts |
| `/app/workspace/select-dir-path` | `app.selectWorkspaceDirPath` | app.ts |
| `/app/initialize` | `app.initializeApp` | app.ts |
| `/app/sync` | `app.syncApp` | app.ts |
| `/tree/root-node-id/get` | `tree.getRootNodeId` | tree.ts |
| `/tree/node/get` | `tree.getNode` | tree.ts |
| `/view/tree/nodes/get` | `tree.getViewTreeNodes` | tree.ts |
| `/nodes/title/update` | `tree.updateNodeTitle` | tree.ts |
| `/favorites/get` | `favorite.getFavorites` | favorite.ts |
| `/view/tree/nodes/new/add-after` | `treeView.addNewNodeAfter` | treeView.ts |
| `/view/tree/nodes/remove` | `treeView.removeNode` | treeView.ts |

**미사용 채널** (CHANNELS에만 정의, 실제 핸들러 없음):
- `/nodes/table/get`
- `/nodes/title/get`

→ 핸들러가 없으므로 마이그레이션에서 제외

## 검증 기준

### 컴파일 타임
- ✅ TypeScript 타입 체크 통과
- ✅ ESLint 통과
- ✅ `pnpm typecheck` 성공

### 런타임
- ✅ 앱 초기화 동작 (isInitialized, selectWorkspaceDirPath, initializeApp)
- ✅ 앱 동기화 동작 (syncApp)
- ✅ 트리 노드 조회 (getRootNodeId, getNode, getViewTreeNodes)
- ✅ 노드 수정 (updateNodeTitle)
- ✅ 즐겨찾기 조회 (getFavorites)
- ✅ 트리뷰 조작 (addNewNodeAfter, removeNode)

### 개발자 경험
- ✅ 핸들러 추가 시 1곳만 수정 (main/ipc/*.ts)
- ✅ 타입 자동 추론 (window.api 사용 시 타입 완성)
- ✅ 채널 이름 오타 방지 (타입 체크)

## 예상 산출물

1. **수정된 Main 핸들러**: `main/ipc/{app,tree,favorite,treeView}.ts`
2. **타입 추출 로직**: `main/ipc/index.ts`
3. **공통 타입**: `common/channel.type.ts`
4. **Proxy 기반 Preload**: `preload/index.ts`, `preload/index.d.ts`
5. **수정된 Main Entry**: `main/index.ts`
6. **마이그레이션된 Renderer**: `renderer/repo/{app,tree,node,favorite,treeView}.ts`
7. **삭제**: `common/channel.const.ts`

## 리스크 및 대응

### 리스크 1: BrowserWindow 접근 (selectWorkspaceDirPath)
**문제**: 기존 핸들러는 `event.sender`로 window 접근, 새 구조에서는 params만 받음
**대응**:
```typescript
// 옵션 1: event를 params에 포함 (타입 복잡도 증가)
// 옵션 2: 별도 헬퍼로 처리 (현재 창 가져오기)
```
→ Phase 1에서 구체적 해결 방안 결정 필요

### 리스크 2: 파라미터 없는 핸들러
**문제**: `isInitialized()`, `syncApp()` 등 파라미터가 없는 핸들러
**대응**: `params: void` 또는 `params?: undefined` 처리

### 리스크 3: 기존 코드 호환성
**문제**: 빅뱅 마이그레이션이라 중간 단계 없음
**대응**: Phase별 순차 실행 후 각 Phase 완료 시 컴파일 확인

## 다음 단계

1. Architect Agent에게 Phase 1 작업 할당
2. BrowserWindow 접근 방안 결정
3. 파라미터 없는 핸들러 타입 처리 방안 확인
