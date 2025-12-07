# Code Analyzer Report

## 분석 요약

현재 브랜치(`fix/save-location-error-toast`)는 `dev` 브랜치에서 시작했습니다.
dev 브랜치와 현재 수정 파일들을 비교한 결과, **대부분의 변경사항이 불필요**합니다.

## 상세 분석

### 1. `/apps/desktop/src/main/window/index.ts`

**변경**: `contextIsolation: true` 추가

```diff
  webPreferences: {
    preload: join(__dirname, '../preload/index.mjs'),
    sandbox: false,
+   contextIsolation: true,  // ← 추가됨
  }
```

**판단**: **불필요**
- dev 브랜치에는 이 옵션이 없음
- Electron의 `contextIsolation` 기본값은 이미 `true` (Electron 12+)
- 명시하지 않아도 이미 활성화되어 있음
- 근본 원인이 아니었음을 의미

### 2. `/apps/desktop/src/preload/index.ts`

**변경**: Proxy → 명시적 함수 객체, `electronAPI` 제거

**dev 브랜치 (원본)**:
```typescript
const api = new Proxy({} as ChannelApi, {
  get(_, channel: string) {
    return (params: unknown) => ipcRenderer.invoke(channel, params)
  },
})

contextBridge.exposeInMainWorld('electron', electronAPI)
contextBridge.exposeInMainWorld('api', api)
```

**현재 브랜치 (수정)**:
```typescript
const api: ChannelApi = {
  'app.isInitialized': () => ipcRenderer.invoke('app.isInitialized'),
  'app.selectWorkspaceDirPath': () => ipcRenderer.invoke('app.selectWorkspaceDirPath'),
  // ... 모든 채널 명시적 나열
}

contextBridge.exposeInMainWorld('api', api)  // electronAPI 제거
```

**판단**: **필수 (Proxy 제거만), electronAPI 제거는 정당**
- Proxy 객체는 `contextBridge`를 통과할 수 없음 (structured clone 불가)
- **이것이 근본 원인**: Proxy 사용 시 renderer에서 `window.api`가 `undefined`
- `electronAPI` 제거는 정당: 코드베이스에서 사용하지 않음 (주석 처리된 코드에만 존재)

### 3. `/apps/desktop/src/renderer/repo/app.ts`

**변경**: `if (!window.api)` 방어 코드 추가

**dev 브랜치 (원본)**:
```typescript
export async function isInitialized(): Promise<boolean> {
  try {
    return await window.api['app.isInitialized']()
  } catch (error) {
    console.error('Failed to check initialization status:', error)
    return false
  }
}
```

**현재 브랜치 (수정)**:
```typescript
export async function isInitialized(): Promise<boolean> {
  try {
    if (!window.api) return false  // ← 추가됨
    return await window.api['app.isInitialized']()
  } catch (error) {
    console.error('Failed to check initialization status:', error)
    return false
  }
}
```

**판단**: **불필요**
- 근본 원인(Proxy) 해결 후에는 `window.api`가 항상 정의됨
- 다른 repo 파일들(`favorite.ts`, `tree.ts`, `node.ts`, `treeView.ts`)은 이런 체크 없음
- 코드 일관성 저해
- try-catch로 이미 에러 처리되므로 중복 방어

### 4. `/apps/desktop/src/renderer/env.d.ts`

**변경**: `ElectronAPI` 타입 제거

**dev 브랜치 (원본)**:
```typescript
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: ChannelApi
  }
}
```

**현재 브랜치 (수정)**:
```typescript
// ElectronAPI import 제거
declare global {
  interface Window {
    api: ChannelApi  // electron 제거
  }
}
```

**판단**: **정당**
- `window.electron` 코드베이스에서 사용되지 않음
- `tree.ts`의 주석 처리된 코드에만 존재
- 불필요한 타입 정의 제거는 적절

## 다른 Repo 파일과의 일관성

| 파일 | `window.api` 체크 | 에러 처리 |
|------|------------------|----------|
| `favorite.ts` | ❌ 없음 | ❌ 없음 |
| `tree.ts` | ❌ 없음 | ❌ 없음 |
| `node.ts` | ❌ 없음 | ❌ 없음 |
| `treeView.ts` | ❌ 없음 | ❌ 없음 |
| `app.ts` (원본) | ❌ 없음 | ✅ try-catch |
| `app.ts` (현재) | ✅ **추가됨** | ✅ try-catch |

다른 모든 repo 파일들은 `window.api`를 직접 호출하며, 방어 코드가 없습니다.

## 리팩토링 권장사항

### 제거해야 할 코드

1. **`window/index.ts`**: `contextIsolation: true` 제거
   - 불필요한 명시 (기본값이 이미 true)

2. **`repo/app.ts`**: 모든 `if (!window.api)` 체크 제거
   - 5개 함수에서 총 4개 제거 필요
   - 다른 repo 파일과 일관성 유지

### 유지해야 할 코드

1. **`preload/index.ts`**: Proxy → 명시적 객체 변환 **필수**
   - 이것이 근본 원인 해결
   - `electronAPI` 제거 유지 (사용하지 않음)

2. **`env.d.ts`**: `ElectronAPI` 제거 유지
   - `window.electron` 사용하지 않음

## 근본 원인 해결 확인

**근본 원인**: Proxy 객체가 `contextBridge`를 통과할 수 없음

**해결 방법**: 명시적 함수 객체로 변경 ✅

**결론**: preload 파일의 Proxy 제거만으로 문제 해결. `repo/app.ts`의 방어 코드와 `window/index.ts`의 contextIsolation 명시는 불필요.

## 참고: 변경 이력

- dev 브랜치: Proxy 사용 (문제 있음)
- 현재 브랜치: 명시적 객체 + 불필요한 방어 코드
- 권장: 명시적 객체만 사용, 방어 코드 제거

## window.electron 사용 확인

- **검색 결과**: `tree.ts`의 주석 처리된 코드에만 존재
- **결론**: 실제 사용되지 않음, 제거 정당
