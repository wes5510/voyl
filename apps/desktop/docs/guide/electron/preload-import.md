# Preload Import 가이드

## Process Context 이해

Electron은 3개의 서로 다른 context에서 코드가 실행됨:

| Context | 접근 가능 | 불가능 |
|---------|----------|--------|
| **Main** | Node.js, Electron main API (`ipcMain`, `BrowserWindow`) | DOM |
| **Preload** | Node.js, DOM, `contextBridge` | Electron main API |
| **Renderer** | DOM, `window.api` | Node.js, Electron API |

## Preload 제약사항

**preload에서 import 시 주의:**

```typescript
// ❌ 잘못된 예: main-only 모듈 간접 import
import { channelNames } from '../main/ipc/index.js'
// main/ipc/index.js가 ipcMain을 import하면 런타임 에러!

// ✅ 올바른 예: 순수 파일에서 import
import { CHANNELS } from '../common/channel.js'
// common/channel.js는 어떤 Electron API도 import하지 않음
```

## 간접 의존성 체크리스트

preload에서 파일 import 전 확인:

1. 해당 파일이 `ipcMain`, `BrowserWindow`, `dialog` 등 main-only 모듈 import하는가?
2. 해당 파일이 import하는 다른 파일들은?
3. 의존성 체인 어디에도 main-only 모듈이 없는가?

## 안전한 파일 구조

```
common/           # main, preload, renderer 모두 사용 가능
├── channel.ts    # CHANNELS, Channel 타입 (순수)
├── types/        # 공유 타입

main/
├── ipc/          # main에서만 사용 (ipcMain 사용)
└── model/        # main에서만 사용

preload/
└── index.ts      # common만 import, main은 타입만 import

renderer/
└── ...           # common만 import, main은 타입만 import
```

## 타입 import vs 값 import

```typescript
// ✅ 타입만 import (런타임에 제거됨, 안전)
import type { ChannelApi } from '../main/ipc/index.js'

// ❌ 값 import (런타임에 파일 로드, main-only 의존성 있으면 에러)
import { channelNames } from '../main/ipc/index.js'
```
