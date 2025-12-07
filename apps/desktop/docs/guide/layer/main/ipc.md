# main/ipc 구조

## 핵심
핸들러 정의에서 타입 자동 추론. **1곳만 수정**하면 타입+등록+preload API 모두 자동 반영.

## 구조
```
ipc/
├── index.ts      # 통합 + 타입 추출 + channelNames export + 등록
├── app.ts        # 앱 핸들러
├── tree.ts       # 트리 핸들러
└── [domain].ts   # 도메인별 핸들러
```

## 핸들러 추가하기

**1. 핸들러 정의 (새 파일 또는 기존 파일)**
```typescript
// ipc/workspace.ts
export const workspaceHandlers = {
  'workspace.getSettings': async (): Promise<Settings> => {
    return WorkspaceModel.getSettings()
  },
}
```

**2. index.ts에 import 추가**
```typescript
import { workspaceHandlers } from './workspace.js'
const handlers = { ...appHandlers, ...workspaceHandlers }
```

끝. 타입 추론 + 핸들러 등록 + preload API 자동 생성.

## 자동화 세부 사항

### channelNames export
`index.ts`는 `channelNames`를 export하여 preload가 동적으로 API를 생성합니다:

```typescript
// main/ipc/index.ts
export const channelNames = Object.keys(handlers) as ChannelKeys[]
```

### preload 자동 생성
preload는 `channelNames`를 import하여 수동 함수 정의 없이 API를 생성합니다:

```typescript
// preload/index.ts
import { channelNames, type ChannelApi } from '../main/ipc/index.js'

const api = Object.fromEntries(
  channelNames.map((channel) => [
    channel,
    (params?: unknown) => ipcRenderer.invoke(channel, params),
  ]),
) as ChannelApi
```

**효과**: 새 채널 추가 시 preload 수정 불필요. main/ipc에만 집중.

## 규칙

- **채널명**: `domain.action` (예: `app.sync`, `tree.getNode`)
- **Import**: `model`, `common`만 가능
