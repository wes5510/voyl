# IPC 보일러플레이트 제거 - 동적 함수 객체 생성

**작성일**: 2025-12-07
**작성자**: Planner Agent

## 작업 목표

preload에서 채널 목록을 기반으로 동적으로 함수 객체를 생성하여 보일러플레이트를 제거합니다.

### 핵심 전략

- **main에서 channelNames export**: `Object.keys(handlers)` 기반
- **preload에서 동적 생성**: `Object.fromEntries` + `map`으로 함수 객체 구성
- **타입 안전성 유지**: `ChannelApi` 타입은 기존과 동일하게 유지

### 검증 완료 사항

- ✅ preload에서 main 모듈 import 가능
- ✅ 동적 생성 함수 객체 contextBridge 통과 가능 (Proxy와 달리 plain 함수 객체)
- ✅ 타입 안전성 유지 가능

## 영향 범위

### 파일 수정
- `main/ipc/index.ts` - channelNames export 추가
- `preload/index.ts` - 동적 함수 객체 생성 로직으로 교체

### 영향 없음
- `main/ipc/*.ts` - 핸들러 파일들 (변경 없음)
- `renderer/repo/*.ts` - 사용처 (변경 없음)
- `common/channel.type.ts` - 타입 파일 (변경 없음)

## 구현 상세

### Before (현재)

```typescript
// preload/index.ts
const api: ChannelApi = {
  'app.isInitialized': () => ipcRenderer.invoke('app.isInitialized'),
  'app.selectWorkspaceDirPath': () => ipcRenderer.invoke('app.selectWorkspaceDirPath'),
  'app.initialize': (workspaceDirPath) => ipcRenderer.invoke('app.initialize', workspaceDirPath),
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
```

**문제점**: 새 채널 추가 시 수동으로 함수 정의 필요 (12개 함수)

### After (목표)

```typescript
// main/ipc/index.ts
export const channelNames = Object.keys(handlers) as ChannelKeys[]

// preload/index.ts
import { contextBridge, ipcRenderer } from 'electron'
import { channelNames, type ChannelApi } from '../main/ipc/index.js'

const api = Object.fromEntries(
  channelNames.map(channel => [
    channel,
    (params?: unknown) => ipcRenderer.invoke(channel, params)
  ])
) as ChannelApi

contextBridge.exposeInMainWorld('api', api)
```

**개선점**:
- 새 채널 추가 시 preload 수정 불필요
- 타입 안전성 유지 (`as ChannelApi` 단언)
- structured clone 호환 (plain 함수 객체)

## 실행 계획

### Phase 1 (직렬)

1. **common-generator** - main/ipc/index.ts 수정
   - 의존성: 없음
   - 작업: `channelNames` export 추가
   - 산출물: `export const channelNames = Object.keys(handlers) as ChannelKeys[]`

### Phase 2 (직렬)

1. **common-generator** - preload/index.ts 전면 교체
   - 의존성: Phase 1 완료
   - 작업: 동적 함수 객체 생성 로직으로 교체
   - 산출물: 새 preload 구현

### Phase 3 (직렬)

1. **tester** - 검증
   - 의존성: Phase 2 완료
   - 작업: 타입체크, 린트, 앱 실행 확인
   - 산출물: 검증 결과

## Agent별 상세 작업

### common-generator (Phase 1)

**파일**: `apps/desktop/src/main/ipc/index.ts`

**작업**:
1. 기존 export 유지
2. channelNames export 추가:
   ```typescript
   export const channelNames = Object.keys(handlers) as ChannelKeys[]
   ```

**산출물**: 수정된 main/ipc/index.ts

### common-generator (Phase 2)

**파일**: `apps/desktop/src/preload/index.ts`

**작업**:
1. 기존 명시적 api 객체 제거
2. 동적 생성 로직으로 교체:
   ```typescript
   import { contextBridge, ipcRenderer } from 'electron'
   import { channelNames, type ChannelApi } from '../main/ipc/index.js'

   const api = Object.fromEntries(
     channelNames.map(channel => [
       channel,
       (params?: unknown) => ipcRenderer.invoke(channel, params)
     ])
   ) as ChannelApi

   contextBridge.exposeInMainWorld('api', api)
   ```

**산출물**: 수정된 preload/index.ts

### tester (Phase 3)

**검증 항목**:
1. 타입체크 통과: `pnpm typecheck`
2. 린트 통과: `pnpm lint`
3. 앱 실행 확인:
   - 앱 초기화 (isInitialized, selectWorkspaceDirPath, initialize)
   - 앱 동기화 (sync)
   - 트리 노드 조회/수정
   - 즐겨찾기 조회
   - 트리뷰 조작

**산출물**: 검증 보고서

## 검증 기준

### 컴파일 타임
- ✅ TypeScript 타입 체크 통과
- ✅ ESLint 통과
- ✅ `pnpm typecheck` 성공

### 런타임
- ✅ 모든 IPC 채널 정상 동작
- ✅ 타입 추론 정상 (window.api 사용 시 자동 완성)
- ✅ 파라미터 전달 정상 (있는 경우/없는 경우 모두)

### 개발자 경험
- ✅ 새 채널 추가 시 preload 수정 불필요
- ✅ 타입 안전성 유지
- ✅ 코드 간결성 향상 (12개 함수 정의 → 3줄 로직)

## 리스크 및 대응

### 리스크 1: 타입 단언 안전성

**문제**: `as ChannelApi` 단언으로 타입을 강제하므로 런타임 불일치 가능성

**대응**:
- main/ipc/index.ts에서 channelNames가 handlers 키와 동기화 보장 (`Object.keys`)
- tester에서 런타임 검증 철저히 수행

### 리스크 2: 파라미터 타입 손실

**문제**: `(params?: unknown)`로 모든 함수를 생성하므로 개별 파라미터 타입 손실

**현황**:
- 현재도 preload에서는 개별 타입 지정 없음
- 타입 안전성은 ChannelApi 타입 단언으로 보장
- renderer에서 `window.api.xxx()` 사용 시 타입 추론 정상 작동

**대응**: 추가 조치 불필요 (기존과 동일)

## 예상 산출물

1. **수정된 main/ipc/index.ts**: channelNames export 추가
2. **수정된 preload/index.ts**: 동적 함수 객체 생성 (12개 함수 → 3줄)
3. **검증 보고서**: tester 결과

## 다음 단계

1. common-generator에게 Phase 1 작업 할당 (main/ipc/index.ts)
2. common-generator에게 Phase 2 작업 할당 (preload/index.ts)
3. tester에게 Phase 3 작업 할당 (검증)
