# Preload IPC Import 런타임 에러 수정 계획

**작성일**: 2025-12-07
**작성자**: Planner Agent

## 작업 목표

preload에서 `main/ipc/index.ts` import 시 `ipcMain`이 간접 로드되는 문제를 해결하여 런타임 에러 방지.

### 핵심 문제
- preload는 renderer context에서 실행 → main-only 모듈(`ipcMain`) import 불가
- 현재 `channelNames`를 `main/ipc/index.ts`에서 import → top-level `ipcMain` import로 인한 오류

### 해결 방향
- `channelNames`를 별도 파일로 분리하여 main-only 모듈 의존성 제거
- 타입 안전성 유지 (handlers와 channelNames 일치 검증)

## 영향 범위

### Backend (Main Process)
- **main/ipc/channel-names.ts** (신규) - 순수 채널 목록 (main-only 모듈 없음)
- **main/ipc/index.ts** - re-export 방식으로 변경
- **common/channel.type.ts** - 변경 없음 (타입만 import하므로 안전)

### Preload
- **preload/index.ts** - import 경로 변경 (`main/ipc/channel-names.ts`로)

## 실행 계획

### Phase 1: 채널 목록 분리 및 검증 (직렬)

**담당**: be-ipc-generator

#### 작업 1-1: channel-names.ts 생성
**파일**: `/apps/desktop/src/main/ipc/channel-names.ts`

```typescript
// main-only 모듈 import 없음
export const channelNames = [
  'app.isInitialized',
  'app.selectWorkspaceDirPath',
  'app.initialize',
  'app.sync',
  'tree.getRootNodeId',
  'tree.getNode',
  'tree.getViewTreeNodes',
  'tree.updateNodeTitle',
  'favorite.getFavorites',
  'treeView.addNewNodeAfter',
  'treeView.removeNode',
] as const

export type ChannelKeys = (typeof channelNames)[number]
```

#### 작업 1-2: main/ipc/index.ts 수정
**파일**: `/apps/desktop/src/main/ipc/index.ts`

**변경 사항**:
1. `channelNames` 정의 제거 (37번째 줄)
2. re-export 추가:
   ```typescript
   export { channelNames, type ChannelKeys } from './channel-names.js'
   ```
3. 타입 검증 추가 (컴파일 타임 일치 확인):
   ```typescript
   import { channelNames, type ChannelKeys } from './channel-names.js'
   import type { Handlers } from './index.js'  // 순환 참조 방지

   // handlers 정의 후...

   // 컴파일 타임 검증: channelNames와 handlers 일치 확인
   type _AssertChannelsMatch = ChannelKeys extends keyof Handlers
     ? keyof Handlers extends ChannelKeys
       ? true
       : never
     : never
   const _check: _AssertChannelsMatch = true
   ```

#### 작업 1-3: preload/index.ts 수정
**파일**: `/apps/desktop/src/preload/index.ts`

**변경 전**:
```typescript
import { channelNames, type ChannelApi } from '../main/ipc/index.js'
```

**변경 후**:
```typescript
import { channelNames } from '../main/ipc/channel-names.js'
import type { ChannelApi } from '../common/channel.type.js'
```

### Phase 2: 검증 (직렬)

**담당**: tester

#### 검증 항목

**컴파일 타임**:
- TypeScript 타입 체크 통과 (`pnpm typecheck`)
- 타입 검증: channelNames와 handlers 불일치 시 컴파일 오류 발생 확인
- ESLint 통과 (`pnpm lint`)

**빌드**:
- preload 빌드 성공 (`out/preload/index.mjs` 생성)
- main 빌드 성공

**런타임**:
- 앱 시작 성공
- window.api 정의됨 (DevTools console에서 `window.api` 확인)
- IPC 호출 정상 작동:
  - `app.isInitialized` 호출 성공
  - 노드 조회/수정 등 기존 기능 정상 작동

## Agent별 상세 작업

### be-ipc-generator

#### 산출물
1. **channel-names.ts** - 순수 채널 목록 (11개)
2. **main/ipc/index.ts** - re-export + 타입 검증
3. **preload/index.ts** - import 경로 변경

#### 참고 패턴
- **channel-names.ts**: 절대로 main-only 모듈 import 금지
  - ❌ `ipcMain`, `BrowserWindow`, `app` 등
  - ✅ 순수 값만 export
- **타입 검증**: bug-analyzer.md 292-297행 참조

#### 주의사항
1. **as const 필수**: `channelNames`에 `as const` 없으면 타입이 `string[]`로 추론됨
2. **채널 목록 정확성**: 현재 handlers와 정확히 일치해야 함 (11개)
3. **import 순서**: 순환 참조 방지

### tester

#### 검증 순서
1. `pnpm typecheck` - 타입 오류 확인
2. 타입 검증 테스트:
   - `channel-names.ts`에 없는 채널을 handlers에 추가 → 컴파일 오류 확인
   - 롤백 후 다시 빌드 성공 확인
3. `pnpm build` - 빌드 성공 확인
4. `pnpm dev` - 런타임 테스트
   - 콘솔에 preload 오류 없는지 확인
   - `window.api` 정의 확인
   - 앱 초기화 기능 테스트

## 예상 산출물

1. **main/ipc/channel-names.ts** - 순수 채널 목록 파일
2. **수정된 main/ipc/index.ts** - re-export + 타입 검증
3. **수정된 preload/index.ts** - import 경로 변경

## 검증 기준

### 컴파일 타임
- ✅ TypeScript 타입 체크 통과
- ✅ channelNames와 handlers 불일치 시 컴파일 오류 발생
- ✅ ESLint 통과

### 빌드
- ✅ preload 빌드 성공
- ✅ main 빌드 성공

### 런타임
- ✅ preload 스크립트 로딩 성공 (오류 로그 없음)
- ✅ window.api 정의됨
- ✅ IPC 호출 정상 작동

## 리스크 및 대응

### 리스크 1: channelNames 수동 관리
**문제**: handlers 추가 시 channel-names.ts도 수정 필요 (2곳 수정)

**대응**: 컴파일 타임 검증으로 불일치 방지
- 타입 검증 코드가 handlers와 channelNames 불일치 시 컴파일 오류 발생
- 새 채널 추가 시 즉시 발견 가능

### 리스크 2: 순환 참조
**문제**: `main/ipc/index.ts`에서 `channel-names.ts` import, 타입 검증 시 자기 자신 참조

**대응**: import type 사용
```typescript
import type { Handlers } from './index.js'  // 타입만 import → 순환 참조 방지
```

### 리스크 3: 기존 코드 호환성
**문제**: preload import 경로 변경으로 인한 영향

**대응**:
- `common/channel.type.ts`는 변경 없음 (타입만 import)
- renderer는 preload를 직접 import하지 않음 (window.api 사용)
- 영향 범위: preload/index.ts만

## 다음 단계

1. Orchestrator에게 보고
2. **be-ipc-generator** 실행 요청 (Phase 1)
3. **tester** 실행 요청 (Phase 2)
