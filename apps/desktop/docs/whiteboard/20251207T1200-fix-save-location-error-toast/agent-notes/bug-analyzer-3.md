# Bug Analyzer Report (3차) - IPC API 초기화 실패

## 근본 원인

**`preload/index.ts`의 15번 라인에서 존재하지 않는 속성을 사용**

```typescript
if (process.contextIsolated) {  // ❌ 이 속성은 존재하지 않음!
  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('api', api)
}
```

### 문제 상세

1. **`process.contextIsolated`는 Electron에 존재하지 않는 속성**
   - Electron 공식 문서에 없음
   - Node.js process 객체에도 없음
   - 항상 `undefined` 또는 `false`로 평가됨

2. **조건문 결과**
   - `if (process.contextIsolated)` → 항상 false
   - `contextBridge.exposeInMainWorld()` 실행 안 됨
   - `else` 블록 실행 → `window.api = api` 시도
   - 하지만 `contextIsolation: true`이므로 `window` 직접 수정 불가
   - 결과: `window.api`가 설정되지 않음

3. **왜 이전에는 동작했나?**
   - `contextIsolation: false` (기본값 또는 명시적 설정)였을 때는 `else` 블록이 동작
   - `window` 직접 수정 가능했음
   - `contextIsolation: true`로 변경하면서 문제 발생

## 증상

- "IPC API not initialized" 에러
- `window.api` undefined
- renderer에서 IPC 통신 불가

## 영향 범위

- **파일**: `apps/desktop/src/preload/index.ts`
- **영향 받는 기능**: 모든 IPC 통신
- **심각도**: Critical (앱 전체가 동작 안 함)

## 수정 전략

### 옵션 1: 조건문 제거 (권장)

`contextIsolation: true`로 설정했으므로, 항상 `contextBridge` 사용:

```typescript
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { ChannelApi } from '../common/channel.type.js'

const api = new Proxy({} as ChannelApi, {
  get(_, channel: string) {
    return (params: unknown) => ipcRenderer.invoke(channel, params)
  },
})

contextBridge.exposeInMainWorld('electron', electronAPI)
contextBridge.exposeInMainWorld('api', api)
```

### 옵션 2: 올바른 조건 사용 (비권장)

Electron은 `process.contextIsolated` 제공 안 하므로, 설정값을 직접 확인해야 함:

```typescript
// webPreferences에서 설정한 값을 확인하는 방법이 없음
// contextIsolation 여부를 런타임에서 확인하는 표준 API 없음
```

이 방법은 불가능하거나 복잡함.

### 옵션 3: `contextIsolation: false` 유지 (안티패턴)

보안상 권장하지 않음.

## 권장 조치

**옵션 1 선택 - 조건문 완전 제거**

### 이유

1. **간결성**: 불필요한 조건문 제거
2. **보안**: `contextIsolation: true` 유지
3. **명확성**: 코드 의도가 분명함
4. **표준**: Electron 공식 문서 권장 패턴

### 수정 레이어

- **Frontend Repo 레이어**: preload 스크립트는 renderer repo와 유사한 역할
- **권장 Agent**: `fe-repo-generator` 또는 오케스트레이터가 직접 수정 (간단한 변경)

## 검증 방법

1. **개발 환경**
   ```bash
   pnpm dev
   ```
   - DevTools Console에서 `window.api` 확인
   - `window.api['app.isInitialized']()` 호출 테스트

2. **에러 확인**
   - "IPC API not initialized" 메시지 사라져야 함
   - 저장 위치 선택 기능 정상 동작

3. **빌드 확인**
   ```bash
   pnpm build:unpack
   ```
   - 프로덕션 빌드에서도 동일하게 동작 확인

## 추가 발견 사항

### `@electron-toolkit/preload` 사용 패턴

현재 코드는 `@electron-toolkit/preload`의 `electronAPI`를 사용 중:

```typescript
import { electronAPI } from '@electron-toolkit/preload'
```

이 라이브러리의 예제 코드를 확인하면, **조건문 없이 바로 `contextBridge` 사용**하는 것이 표준 패턴.

### Electron 37.7.1 기본값

- `contextIsolation`: **true** (Electron 12부터 기본값)
- `nodeIntegration`: **false** (기본값)
- `sandbox`: **false** (macOS/Linux 기본값)

따라서 `webPreferences`에 명시적으로 `contextIsolation: true`를 추가한 것은 중복이지만 명확성 측면에서 좋음.

## 결론

**구현 버그** (설계 문제 아님)

- `process.contextIsolated` 속성이 존재한다고 잘못 가정
- 조건문 제거로 간단히 해결 가능
- architect 필요 없음
- fe-repo-generator 또는 오케스트레이터가 직접 수정