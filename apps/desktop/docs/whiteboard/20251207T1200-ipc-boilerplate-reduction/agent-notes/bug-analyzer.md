# Bug Analyzer: Preload에서 Main-only 모듈 Import 실패

## 증상 요약

```
Unable to load preload script: .../out/preload/index.mjs
SyntaxError: The requested module 'electron' does not provide an export named 'BrowserWindow'
Failed to check initialization status: TypeError: Cannot read properties of undefined (reading 'app.isInitialized')
```

- preload 스크립트 로딩 실패
- window.api가 undefined → renderer에서 IPC 호출 불가
- 앱 초기화 불가

---

## 수집된 정보 종합

### code-researcher (직접 확인)

**문제 코드:**
```typescript
// preload/index.ts (2번째 줄)
import { channelNames, type ChannelApi } from '../main/ipc/index.js'
```

**import 체인:**
```
preload/index.ts
  → main/ipc/index.ts (line 1)
    → import { ipcMain } from 'electron'  // ❌ main-only 모듈
    → import { BrowserWindow } from 'electron'  // ❌ (간접 import 가능성)
```

**main/ipc/index.ts 구조:**
```typescript
import { ipcMain } from 'electron'  // line 1
import { appHandlers } from './app.js'
// ...

const handlers = { ...appHandlers, ... }

export type Handlers = typeof handlers
export type ChannelApi = { /* ... */ }
export type ChannelKeys = keyof Handlers
export const channelNames = Object.keys(handlers) as ChannelKeys[]  // line 37
export function registerHandlers() { /* ipcMain.handle 사용 */ }
```

**preload 사용:**
```typescript
// preload/index.ts
const api = Object.fromEntries(
  channelNames.map((channel) => [  // channelNames 사용
    channel,
    (params?: unknown) => ipcRenderer.invoke(channel, params),
  ]),
) as ChannelApi
```

### web-researcher (기존 리서치)

**Electron 제약:**
- preload는 renderer context에서 실행
- main-only 모듈 (`ipcMain`, `BrowserWindow`, `app` 등) import 불가
- preload에서 사용 가능한 모듈:
  - `electron`: `contextBridge`, `ipcRenderer` 등 일부만
  - `fs`, `path` 등 Node.js 모듈 (contextIsolation 설정에 따라)

**타입 import는 안전:**
```typescript
import { type ChannelApi } from '../main/ipc/index.js'  // ✅ 타입만
```

**값 import가 문제:**
```typescript
import { channelNames } from '../main/ipc/index.js'  // ❌ 런타임 값
```

### feature-analyzer (기존 분석)

**보일러플레이트 최소화 시도:**
- 이전: 12개 API를 수동 정의 (명시적 함수 객체)
- 현재: `channelNames` 배열 기반 동적 생성으로 변경
- **부작용**: `channelNames`를 import하면서 `main/ipc/index.ts` 전체가 로드됨 → `ipcMain` import 오류

---

## 근본 원인

### 설정 레이어
문제 없음.

### 코드 레이어
**주 원인**: preload에서 main-only 모듈을 간접 import

```
[원인 체인]
1. (1차) preload가 channelNames를 main/ipc/index.ts에서 import
2. (2차) main/ipc/index.ts가 top-level에서 ipcMain import
3. (3차) preload는 renderer context라서 ipcMain 사용 불가
4. (결과) 모듈 로딩 실패 → preload 스크립트 실행 안 됨 → window.api 없음
```

**구조적 문제:**
- main/ipc/index.ts는 **두 가지 역할**을 동시에 수행:
  1. **Main용**: handlers 등록 (`ipcMain` 사용)
  2. **타입 제공**: `ChannelApi`, `ChannelKeys`, `channelNames` export
- preload는 2번(타입/값)만 필요하지만, 1번(main-only 코드)도 함께 로드됨

### 의존성 레이어
문제 없음.

---

## 수정 전략

### 필수 수정

**전략: channelNames와 타입을 별도 파일로 분리**

**구현 방향:**

#### 1. `common/channel.ts` 생성 (새 파일)
```typescript
// 순수한 타입과 채널 목록만 (main-only 모듈 import 없음)
import type { appHandlers } from '../main/ipc/app.js'
import type { treeHandlers } from '../main/ipc/tree.js'
// ...

type Handlers = typeof appHandlers & typeof treeHandlers & ...

type HandlerParams<T> = /* ... */
type HandlerResult<T> = /* ... */

export type ChannelApi = {
  [K in keyof Handlers]: /* ... */
}

export type ChannelKeys = keyof Handlers

export const channelNames = [
  // app
  'app.isInitialized',
  'app.initialize',
  // tree
  'tree.getAll',
  // ...
] as const satisfies readonly ChannelKeys[]
```

**문제점: handlers를 import 없이 타입 추론 불가**

더 나은 접근:

#### 2. `main/ipc/channel-names.ts` 생성 (새 파일)
```typescript
// main-only 모듈 import 없음
export const channelNames = [
  'app.isInitialized',
  'app.initialize',
  'app.selectWorkspaceDirPath',
  'app.setWorkspaceDirPath',
  'tree.getAll',
  'tree.create',
  'tree.update',
  'tree.remove',
  'favorite.getAllNodeIds',
  'treeView.getSavedPosition',
  'treeView.savePosition',
] as const

export type ChannelKeys = (typeof channelNames)[number]
```

#### 3. `main/ipc/index.ts` 수정
```typescript
import { ipcMain } from 'electron'
import { appHandlers } from './app.js'
import { treeHandlers } from './tree.js'
// ...
import { channelNames } from './channel-names.js'  // 분리된 파일에서 import
import type { ChannelKeys } from './channel-names.js'

const handlers = {
  ...appHandlers,
  ...treeHandlers,
  // ...
}

export type Handlers = typeof handlers

type HandlerParams<T> = /* ... */
type HandlerResult<T> = /* ... */

export type ChannelApi = {
  [K in keyof Handlers]: /* ... */
}

// channelNames는 re-export만
export { channelNames, type ChannelKeys } from './channel-names.js'

export function registerHandlers() {
  Object.entries(handlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, (_, params) =>
      (handler as (params: unknown) => unknown)(params),
    )
  })
}
```

#### 4. `preload/index.ts` 수정
```typescript
import { contextBridge, ipcRenderer } from 'electron'
import { channelNames } from '../main/ipc/channel-names.js'  // ✅ main-only 모듈 없음
import type { ChannelApi } from '../common/channel.type.js'  // 타입은 기존처럼

const api = Object.fromEntries(
  channelNames.map((channel) => [
    channel,
    (params?: unknown) => ipcRenderer.invoke(channel, params),
  ]),
) as ChannelApi

contextBridge.exposeInMainWorld('api', api)
```

#### 5. `common/channel.type.ts` 수정 (필요시)
```typescript
// main/ipc에서 타입 re-export
export type { ChannelApi, ChannelKeys } from '../main/ipc/index.js'
```

**변경 없음 (타입만 import하므로 안전)**

---

### 권장 수정 (선택)

**타입 안전성 강화:**

현재 `channelNames`는 수동 배열이므로, handlers와 불일치 가능성:
```typescript
// ❌ 타입 오류 감지 안 됨
const channelNames = [
  'app.isInitialized',
  'app.init',  // 오타! (실제는 'app.initialize')
] as const
```

**개선안: handlers에서 추출하여 검증**

```typescript
// main/ipc/channel-names.ts
import { appHandlers } from './app.js'
import { treeHandlers } from './tree.js'
// ...

// handlers를 임시로 생성 (타입 검증용)
const _handlers = {
  ...appHandlers,
  ...treeHandlers,
  // ...
}

export const channelNames = Object.keys(_handlers) as Array<keyof typeof _handlers>
export type ChannelKeys = keyof typeof _handlers
```

**문제점**: `./app.js` 등을 import하면 간접적으로 main-only 모듈 로드 가능

**최종 권장: 수동 배열 + 빌드타임 검증**

```typescript
// main/ipc/channel-names.ts
export const channelNames = [
  'app.isInitialized',
  // ...
] as const

export type ChannelKeys = (typeof channelNames)[number]
```

```typescript
// main/ipc/index.ts
import { channelNames, type ChannelKeys } from './channel-names.js'

const handlers = { /* ... */ }

// 컴파일 타임 검증: channelNames와 handlers 일치 확인
type _AssertChannelsMatch = ChannelKeys extends keyof typeof handlers
  ? keyof typeof handlers extends ChannelKeys
    ? true
    : never
  : never
const _check: _AssertChannelsMatch = true
```

**장점:**
- ✅ 타입 불일치 시 컴파일 오류
- ✅ main-only 모듈 import 없음
- ✅ preload에서 안전하게 import 가능

**단점:**
- ❌ 여전히 수동으로 channelNames 유지 필요
- ❌ 새 채널 추가 시 2곳 수정 (handlers + channelNames)

---

### 수정 순서

1. **main/ipc/channel-names.ts 생성** - 순수 값만 export (main-only 모듈 없음)
2. **main/ipc/index.ts 수정** - channel-names.ts에서 re-export
3. **preload/index.ts 수정** - import 경로 변경
4. **타입 검증 추가** (선택) - 컴파일 타임 채널 일치 검증

---

### 주의사항

1. **import 체인 주의**: `channel-names.ts`는 절대로 main-only 모듈 import 금지
2. **타입 import는 안전**: `import type { ... }`는 런타임에 제거되므로 main/ipc/index.ts에서 타입 import는 문제없음
3. **as const 필수**: `channelNames`에 `as const` 없으면 타입이 `string[]`로 추론됨
4. **빌드 검증**: 수정 후 반드시 빌드 테스트 (`pnpm build`)

---

## 권장 조치

### 수정 담당

| 수정 내용 | 담당 Generator |
|-----------|----------------|
| `main/ipc/channel-names.ts` 생성 | be-ipc-generator |
| `main/ipc/index.ts` 수정 | be-ipc-generator |
| `preload/index.ts` 수정 | be-ipc-generator (preload는 BE 영역) |
| 타입 검증 추가 (선택) | be-ipc-generator |

**단일 generator 호출**로 충분. 모두 IPC 레이어 변경.

---

## 검증 방법

### 1. 컴파일 타임
```bash
pnpm typecheck
```

**기대 결과:**
- ✅ 타입 오류 없음
- ✅ (타입 검증 추가 시) channelNames와 handlers 불일치 시 컴파일 오류

### 2. 빌드
```bash
pnpm build
```

**기대 결과:**
- ✅ preload 빌드 성공 (`out/preload/index.mjs` 생성)
- ✅ main 빌드 성공

### 3. 런타임
```bash
pnpm dev
```

**기대 결과:**
- ✅ 앱 시작 성공
- ✅ window.api 정의됨 (console에서 확인)
- ✅ IPC 호출 정상 작동

---

## 완료 조건

**실행 준비 완료**

- ✅ 근본 원인 명확: preload가 main-only 모듈을 간접 import
- ✅ 수정 전략 구체적: channel-names.ts 분리
- ✅ 담당 generator 명확: be-ipc-generator
- ✅ 검증 방법 제시
