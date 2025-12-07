# Bug Analysis: Preload Script Proxy Clone Error

## 증상

```
Unable to load preload script: .../out/preload/index.mjs
Error: An object could not be cloned.
  at Object.exposeInMainWorld
```

## 근본 원인

**Proxy 객체는 Structured Clone Algorithm으로 복제할 수 없음**

`contextBridge.exposeInMainWorld`는 메인 월드와 격리된 컨텍스트 간에 객체를 전달하기 위해 structured clone을 사용합니다. Proxy 객체는 이 알고리즘으로 복제할 수 없어 에러가 발생합니다.

### 문제 코드 (`preload/index.ts`)

```typescript
const api = new Proxy({} as ChannelApi, {
  get(_, channel: string) {
    return (params: unknown) => ipcRenderer.invoke(channel, params)
  },
})

contextBridge.exposeInMainWorld('api', api) // ❌ Proxy는 clone 불가
```

## 영향 범위

- `/apps/desktop/src/preload/index.ts` - Preload 스크립트
- Renderer process에서 `window.api.*` 호출 불가
- 앱 전체가 작동하지 않음

## 해결 방법

### 옵션 1: 명시적 함수 객체 생성 (권장)

타입 안전하고 명확한 방법. 각 채널에 대해 함수를 명시적으로 생성합니다.

```typescript
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { ChannelApi } from '../common/channel.type.js'

// 각 채널에 대한 함수를 명시적으로 생성
const api: ChannelApi = {
  'app.isInitialized': () => ipcRenderer.invoke('app.isInitialized'),
  'app.selectWorkspaceDirPath': () => ipcRenderer.invoke('app.selectWorkspaceDirPath'),
  'app.initialize': (params) => ipcRenderer.invoke('app.initialize', params),
  'app.sync': () => ipcRenderer.invoke('app.sync'),

  'tree.getRootNodeId': () => ipcRenderer.invoke('tree.getRootNodeId'),
  'tree.getNode': (params) => ipcRenderer.invoke('tree.getNode', params),
  'tree.getViewNodes': (params) => ipcRenderer.invoke('tree.getViewNodes', params),
  'tree.updateNodeTitle': (params) => ipcRenderer.invoke('tree.updateNodeTitle', params),
  'node.getPreviousFocusableNodeId': (params) => ipcRenderer.invoke('node.getPreviousFocusableNodeId', params),

  'favorite.getAll': () => ipcRenderer.invoke('favorite.getAll'),

  'treeView.addNewNodeAfter': (params) => ipcRenderer.invoke('treeView.addNewNodeAfter', params),
  'treeView.removeNode': (params) => ipcRenderer.invoke('treeView.removeNode', params),
}

contextBridge.exposeInMainWorld('electron', electronAPI)
contextBridge.exposeInMainWorld('api', api) // ✅ 일반 객체는 clone 가능
```

**장점:**
- 타입 안전성 보장 (`ChannelApi` 타입과 일치하지 않으면 컴파일 에러)
- 명확하고 디버깅 용이
- 모든 채널이 명시적으로 나열됨
- Electron 공식 권장 방식

**단점:**
- 새 채널 추가 시 수동으로 추가해야 함
- 코드가 길어짐 (현재 13개 채널)

### 옵션 2: 자동 생성 헬퍼 함수 (타입 불안전)

```typescript
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 채널 목록
const channels = [
  'app.isInitialized',
  'app.selectWorkspaceDirPath',
  'app.initialize',
  'app.sync',
  'tree.getRootNodeId',
  'tree.getNode',
  'tree.getViewNodes',
  'tree.updateNodeTitle',
  'node.getPreviousFocusableNodeId',
  'favorite.getAll',
  'treeView.addNewNodeAfter',
  'treeView.removeNode',
] as const

// 일반 객체로 생성
const api = channels.reduce((acc, channel) => {
  acc[channel] = (params?: unknown) => ipcRenderer.invoke(channel, params)
  return acc
}, {} as Record<string, (params?: unknown) => Promise<unknown>>)

contextBridge.exposeInMainWorld('electron', electronAPI)
contextBridge.exposeInMainWorld('api', api)
```

**장점:**
- DRY 원칙
- 채널 목록만 관리하면 됨

**단점:**
- 타입 안전성 부족 (ChannelApi와 싱크가 맞지 않을 수 있음)
- 채널 목록을 수동으로 유지해야 함 (Proxy보다 나을 게 없음)

### 옵션 3: 타입에서 자동 생성 (중간)

```typescript
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { ChannelApi, ChannelKeys } from '../common/channel.type.js'

// 모든 채널 키 추출
const channelKeys: ChannelKeys[] = [
  'app.isInitialized',
  'app.selectWorkspaceDirPath',
  'app.initialize',
  'app.sync',
  'tree.getRootNodeId',
  'tree.getNode',
  'tree.getViewNodes',
  'tree.updateNodeTitle',
  'node.getPreviousFocusableNodeId',
  'favorite.getAll',
  'treeView.addNewNodeAfter',
  'treeView.removeNode',
]

// 타입 안전한 API 객체 생성
const api = channelKeys.reduce((acc, channel) => {
  acc[channel] = (params?: unknown) => ipcRenderer.invoke(channel, params)
  return acc
}, {} as Record<string, unknown>) as ChannelApi

contextBridge.exposeInMainWorld('electron', electronAPI)
contextBridge.exposeInMainWorld('api', api)
```

**장점:**
- 채널 목록만 관리
- 타입 캐스팅으로 ChannelApi 보장 (런타임에는 검증 안 됨)

**단점:**
- 타입 캐스팅이 완벽하지 않음
- 여전히 수동 관리

## 권장 사항

**옵션 1 (명시적 함수 생성)을 강력히 권장합니다.**

### 이유:

1. **타입 안전성**: TypeScript가 컴파일 타임에 검증. 채널 추가/수정 시 자동으로 에러 발생
2. **명확성**: 어떤 채널이 있는지 한눈에 파악 가능
3. **공식 권장**: Electron 공식 문서에서 이 방식을 권장
4. **유지보수**: 새 채널 추가 시 preload에 추가하지 않으면 컴파일 에러로 즉시 발견
5. **채널 수**: 현재 13개로 관리 가능한 수준. 100개가 아님

### 향후 개선:

만약 채널이 많아지면 (50개 이상) code generator를 고려할 수 있습니다:
- `main/ipc/index.ts`의 `Handlers` 타입을 파싱
- `preload/index.ts`를 자동 생성하는 스크립트
- 빌드 시 자동 실행

하지만 현재로서는 불필요한 복잡성입니다.

## 수정 대상

- `/apps/desktop/src/preload/index.ts` - Proxy 제거, 명시적 함수 객체로 교체

## 추가 고려사항

### 파라미터 처리

현재 Proxy는 모든 채널에 `(params: unknown) => ipcRenderer.invoke(channel, params)` 형태로 전달합니다.

하지만 일부 채널은 파라미터가 없습니다:
- `app.isInitialized`
- `app.selectWorkspaceDirPath`
- `app.sync`
- `tree.getRootNodeId`
- `favorite.getAll`

명시적 함수에서는 이를 정확히 반영해야 합니다:

```typescript
// 파라미터 없는 경우
'app.isInitialized': () => ipcRenderer.invoke('app.isInitialized'),

// 파라미터 있는 경우
'app.initialize': (params) => ipcRenderer.invoke('app.initialize', params),
```

ChannelApi 타입이 이를 강제하므로 TypeScript가 검증합니다.
