# Bug Analysis: 저장 위치 선택 에러 토스트

**분석일**: 2025-12-07
**Agent**: bug-analyzer

## 증상 요약

- 저장 위치 선택 시 `"Electron sandboxed_renderer.bundle.js script failed to run"` 에러
- `"TypeError: object null is not iterable (cannot read property Symbol(Symbol.iterator))"` 에러
- 명시적 함수 객체로 변경 후에도 에러 지속

## 근본 원인

**`@electron-toolkit/preload`의 `electronAPI` 객체가 structured clone 불가능**

### 증거

1. **preload/index.ts:31-32**에서 두 개의 객체를 expose:
   ```typescript
   contextBridge.exposeInMainWorld('electron', electronAPI)  // 문제
   contextBridge.exposeInMainWorld('api', api)               // 정상
   ```

2. **`electronAPI`는 `ipcRenderer` 포함**:
   - `@electron-toolkit/preload` 패키지는 `{ ipcRenderer, webUtils, process }` 구조 제공
   - `window.electron.ipcRenderer.invoke()` 형태로 사용 (`renderer/repo/tree.ts:28` 주석 참조)
   - `ipcRenderer`는 EventEmitter 기반으로 Proxy나 함수 프로토타입 체인 포함

3. **Electron의 contextBridge는 structured clone 사용**:
   - contextBridge로 전달되는 객체는 structured clone 알고리즘 통과해야 함
   - Proxy, 함수 프로토타입, EventEmitter 등은 clone 불가
   - 에러: `"object null is not iterable (cannot read property Symbol(Symbol.iterator))"`

4. **현재 `window.electron`은 사용되지 않음**:
   - `renderer/repo/tree.ts:28`에서 주석 처리됨
   - 모든 IPC 통신은 `window.api`로 진행
   - 불필요한 객체가 에러 유발

## 영향 받는 코드/기능

### 직접 영향
- `apps/desktop/src/preload/index.ts:2,31` - `electronAPI` import 및 expose

### 간접 영향
- `apps/desktop/src/renderer/env.d.ts:3,8` - `ElectronAPI` 타입 선언
- `apps/desktop/src/main/window/index.ts:82` - `sandbox: false` 설정 (추후 개선 고려)

### 잠재적 부작용 없음
- `window.api` 정상 작동 확인됨
- `window.electron` 사용처 없음 (주석 처리만 존재)

## 수정 전략

### 즉시 해결 (구현 버그)
1. `electronAPI` expose 제거
2. 관련 타입 선언 정리

이것은 **단순 구현 버그**입니다. 설계 문제가 아닙니다.

## 권장 수정

### Agent 및 레이어
- **common-generator**: preload, 타입 선언 (공통 레이어)

### 수정 내용

1. **`preload/index.ts`에서 `electronAPI` 관련 코드 제거**:
   ```diff
   - import { electronAPI } from '@electron-toolkit/preload'

   ...

   - contextBridge.exposeInMainWorld('electron', electronAPI)
     contextBridge.exposeInMainWorld('api', api)
   ```

2. **`renderer/env.d.ts`에서 타입 선언 제거**:
   ```diff
   - import { ElectronAPI } from '@electron-toolkit/preload'

   declare global {
     interface Window {
   -   electron: ElectronAPI
       api: ChannelApi
     }
   }
   ```

3. **`package.json`에서 `@electron-toolkit/preload` 의존성 제거 (선택사항)**:
   - 사용하지 않으면 제거
   - 단, `@electron-toolkit/utils`는 `main/window/index.ts:3`에서 사용 중이므로 유지

### 검증
- `window.api` 정상 작동 확인
- `window.electron` 미사용 확인 (grep으로 검색 완료)
- 타입 체크 통과
- 저장 위치 선택 기능 정상 동작

## 추가 개선 (장기)

### sandbox 활성화 고려
현재 `main/window/index.ts:82`에서 `sandbox: false` 설정:
- `contextBridge` + `contextIsolation: true` 사용 중
- preload에서 명시적 API만 노출하므로 sandbox 활성화 가능
- 보안 강화 관점에서 추후 검토

단, 이것은 **이번 버그와 무관**합니다.
