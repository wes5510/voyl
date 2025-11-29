# main/ipc 구조

## 핵심
핸들러 정의에서 타입 자동 추론. **1곳만 수정**하면 타입+등록 자동 반영.

## 구조
```
ipc/
├── index.ts      # 통합 + 타입 추출 + 등록
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

끝. 타입 추론 + 핸들러 등록 자동.

## 규칙

- **채널명**: `domain.action` (예: `app.sync`, `tree.getNode`)
- **Import**: `model`, `common`만 가능
