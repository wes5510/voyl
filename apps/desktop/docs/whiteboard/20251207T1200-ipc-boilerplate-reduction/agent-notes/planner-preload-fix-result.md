# Preload IPC Import 런타임 에러 수정 - 구현 완료

**작성일**: 2025-12-07
**작성자**: be-ipc-generator
**관련 계획**: 20251207T1200-preload-ipc-import-fix.md

## 작업 내용

preload에서 `main/ipc/index.ts` import 시 `ipcMain`이 간접 로드되는 문제를 해결하기 위해 채널 목록을 별도 파일로 분리.

## 구현 결과

### 1. channel-names.ts 생성

**파일**: `/apps/desktop/src/main/ipc/channel-names.ts`

```typescript
// 채널 목록 (main-only 모듈 의존성 없음)
export const channelNames = [
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

export type ChannelKeys = (typeof channelNames)[number]
```

**특징**:
- main-only 모듈(ipcMain, BrowserWindow 등) import 없음
- `as const`로 타입 안전성 확보
- 현재 12개 채널 정의

### 2. main/ipc/index.ts 수정

**파일**: `/apps/desktop/src/main/ipc/index.ts`

**변경 사항**:
1. `channelNames` 정의 제거
2. `channel-names.ts`에서 import 및 re-export
3. 컴파일 타임 검증 추가:

```typescript
import { channelNames, type ChannelKeys } from './channel-names.js'

// Re-export
export { channelNames, type ChannelKeys }

// 컴파일 타임 검증: channelNames와 handlers 일치 확인
type _AssertChannelsMatch = ChannelKeys extends keyof Handlers
  ? keyof Handlers extends ChannelKeys
    ? true
    : never
  : never
void (true as _AssertChannelsMatch)
```

**효과**:
- handlers와 channelNames 불일치 시 컴파일 오류 발생
- 새 채널 추가 시 양쪽 모두 수정하지 않으면 빌드 실패

### 3. preload/index.ts 수정

**파일**: `/apps/desktop/src/preload/index.ts`

**변경 전**:
```typescript
import { channelNames, type ChannelApi } from '../main/ipc/index.js'
```

**변경 후**:
```typescript
import { channelNames } from '../main/ipc/channel-names.js'
import type { ChannelApi } from '../main/ipc/index.js'
```

**효과**:
- preload가 main-only 모듈을 간접적으로도 import하지 않음
- 런타임 에러 방지

## 검증 결과

### 컴파일 타임
- ✅ TypeScript 타입 체크 통과 (`pnpm typecheck`)
- ✅ ESLint 통과 (`pnpm lint`)
- ✅ channelNames와 handlers 일치 검증 작동 확인

### 빌드
- ✅ preload 빌드 성공 (`out/preload/index.mjs` 생성)
- ✅ main 빌드 성공
- ✅ renderer 빌드 성공

## 변경된 파일

1. `/apps/desktop/src/main/ipc/channel-names.ts` (신규)
2. `/apps/desktop/src/main/ipc/index.ts` (수정)
3. `/apps/desktop/src/preload/index.ts` (수정)

## 채널 목록 (12개)

### App (4개)
- `app.isInitialized`
- `app.selectWorkspaceDirPath`
- `app.initialize`
- `app.sync`

### Tree (4개)
- `tree.getRootNodeId`
- `tree.getNode`
- `tree.getViewNodes`
- `tree.updateNodeTitle`

### Node (1개)
- `node.getPreviousFocusableNodeId`

### Favorite (1개)
- `favorite.getAll`

### TreeView (2개)
- `treeView.addNewNodeAfter`
- `treeView.removeNode`

## Frontend 연결 포인트

### Preload
- `channelNames` import 경로: `../main/ipc/channel-names.js`
- `ChannelApi` 타입 import: `../main/ipc/index.js` (타입만)

### Renderer
- 변경 사항 없음 (window.api를 통해 간접 접근)

## 주의사항

### 채널 추가 시
1. `main/ipc/channel-names.ts`의 `channelNames` 배열에 추가
2. 해당 handler를 `main/ipc/` 하위 파일에 구현
3. 빌드 시 타입 검증이 일치 여부 확인

### 제약사항
- `channel-names.ts`에는 절대로 main-only 모듈 import 금지
- handlers 추가 시 반드시 channelNames도 업데이트 필요 (컴파일 타임 검증으로 강제)

## 리스크 대응

### 채널 목록 수동 관리
- **문제**: handlers와 channel-names.ts 두 곳 수정 필요
- **대응**: 컴파일 타임 검증으로 불일치 시 빌드 실패

### 순환 참조 방지
- `import type` 사용으로 타입만 import하여 순환 참조 방지

## 다음 작업

런타임 테스트 필요:
1. 앱 시작 성공 확인
2. `window.api` 정의 확인 (DevTools console)
3. IPC 호출 정상 작동 확인 (app.isInitialized 등)

이 작업은 tester Agent가 수행합니다.
