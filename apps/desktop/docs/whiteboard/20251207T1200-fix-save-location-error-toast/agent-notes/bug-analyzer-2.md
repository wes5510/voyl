# Bug Analysis: Preload Script Not Executing

## 증상 요약
- 저장 위치 선택 시 `window.api`가 undefined
- 에러: "Cannot read properties of undefined (reading 'app.selectWorkspaceDirPath')"
- preload 파일은 존재하고 빌드도 성공했으나 실행되지 않음

## 근본 원인

**`contextIsolation` 옵션이 명시적으로 설정되지 않았음**

### 상세 분석

1. **현재 코드** (`apps/desktop/src/main/window/index.ts:80-83`):
   ```typescript
   webPreferences: {
     preload: join(__dirname, '../preload/index.mjs'),
     sandbox: false,
   }
   ```

2. **preload 코드** (`apps/desktop/src/preload/index.ts:15`):
   ```typescript
   if (process.contextIsolated) {
     // contextBridge 사용
   } else {
     // window 직접 할당
   }
   ```

3. **문제점**:
   - `contextIsolation` 옵션이 명시되지 않아 Electron 기본값에 의존
   - Electron v12+ 에서는 `contextIsolation: true`가 기본값
   - 그러나 일부 환경에서 기본값이 제대로 적용되지 않거나, `process.contextIsolated` 값이 예상과 다를 수 있음
   - preload 스크립트가 실행은 되지만, `process.contextIsolated` 조건 판단이 잘못되어 `window.api`가 설정되지 않음

4. **검증**:
   - 빌드된 파일 확인 결과:
     - `out/main/index.js`: preload 경로 정상 (`../preload/index.mjs`)
     - `out/preload/index.mjs`: 코드 정상 컴파일됨
   - 경로 문제 아님
   - `__dirname` 문제 아님 (electron-vite가 자동 처리)

## 영향 범위

- **영향받는 코드**:
  - `apps/desktop/src/main/window/index.ts` (webPreferences)

- **영향받는 기능**:
  - IPC 통신이 필요한 모든 renderer 기능
  - 저장 위치 선택
  - 기타 모든 window.api 호출

## 수정 전략

### 해결 방법: `contextIsolation` 명시적 설정

**구현 버그**로 분류. 단순 설정 누락.

#### 수정 위치
`apps/desktop/src/main/window/index.ts:80-83`

#### 수정 내용
```typescript
webPreferences: {
  preload: join(__dirname, '../preload/index.mjs'),
  sandbox: false,
  contextIsolation: true,  // 명시적 설정 추가
}
```

#### 이유
1. Electron 보안 베스트 프랙티스: `contextIsolation: true` 권장
2. preload 스크립트가 이미 `contextBridge` 사용하도록 작성됨
3. 명시적 설정으로 환경 간 일관성 보장
4. 기존 아키텍처 변경 불필요

### 대안 고려 사항

**대안 1**: `process.contextIsolated` 체크 제거하고 항상 contextBridge 사용
- 장점: 더 안전
- 단점: 불필요한 코드 변경

**대안 2**: `contextIsolation: false` 설정
- 장점: 즉시 동작 가능
- 단점: 보안 취약, Electron 권장사항 위배

## 권장 수정 Agent 및 레이어

- **Agent**: `be-ipc-generator` 또는 오케스트레이터가 직접 수정 (단순 설정 추가)
- **레이어**: Main Process - Window 레이어
- **파일**: `apps/desktop/src/main/window/index.ts`
- **변경 범위**: 1줄 추가

## 추가 검증 필요 사항

수정 후 다음 확인:
1. 개발 모드에서 `window.api` 정상 노출 여부
2. 저장 위치 선택 기능 동작 확인
3. 다른 IPC 통신 기능들 정상 동작 확인
