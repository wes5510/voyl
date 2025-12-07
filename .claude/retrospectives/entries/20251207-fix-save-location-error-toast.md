# 회고: 저장 위치 선택 에러 토스트 수정

- **일시**: 2025-12-07
- **워크플로우**: bug-fix
- **결과**: 성공

## 호출된 Agent

- **bug-analyzer** (1차): `window.api` undefined, 방어 코드 전략
- **bug-analyzer** (2차): `contextIsolation` 미설정 문제 파악
- **bug-analyzer** (3차): `process.contextIsolated` 속성 존재하지 않음 발견
- **bug-analyzer** (4차): Proxy 객체 structured clone 불가 발견
- **bug-analyzer** (최종): `electronAPI` structured clone 불가 발견
- **tester**: 타입체크 및 린트 검증

## 잘된 점

### 1. 끈질긴 근본 원인 추적
- 4번의 bug-analyzer 호출을 통해 계층적 문제 구조 파악
- 각 수정마다 새로운 근본 원인 발견하며 깊이 있게 탐색
- `contextIsolation` → `process.contextIsolated` → Proxy → `electronAPI` 순서로 문제 해결

### 2. Electron 내부 동작 이해
- contextBridge의 structured clone 알고리즘 이해
- Proxy 객체, EventEmitter, 함수 프로토타입 체인이 clone 불가함을 파악
- `@electron-toolkit/preload`의 `electronAPI` 내부 구조(`ipcRenderer` 포함) 분석

### 3. 명시적 함수 객체로 변경
- Proxy 대신 각 채널을 명시적으로 나열
- 타입 안전성 보장 (`ChannelApi`와 일치하지 않으면 컴파일 에러)
- Electron 공식 권장 방식 준수

### 4. 리팩토링으로 불필요한 코드 제거
- 근본 원인 해결 후 시행착오 코드 재검토
- `contextIsolation: true` 제거 (Electron 기본값)
- `if (!window.api)` 방어 코드 4곳 제거 (일관성 확보)
- 최종적으로 필수 수정만 남김 (preload, env.d.ts)

## 문제점

### 1. 반복된 시행착오
- **1차**: 방어 코드 추가 → 근본 해결 안 됨
- **2차**: `contextIsolation: true` 추가 → 여전히 에러
- **3차**: Proxy → 명시적 함수 객체 → 여전히 에러
- **4차**: `electronAPI` 제거 → 해결
- **원인**: 초기 분석에서 여러 문제를 동시에 파악하지 못함
- **영향**: 4번의 bug-analyzer 호출, 중복된 수정 작업

### 2. `process.contextIsolated` 오류 발견 지연
- preload 스크립트에 존재하지 않는 속성 사용
- 조건문이 항상 false로 평가되어 `window.api` 설정 실패
- **문제**: 2차 분석까지는 이 오류를 간과함
- **근본 원인**: 코드 리뷰 단계에서 Electron API 검증 부족

### 3. Generator 미호출
- planner 없이 오케스트레이터가 직접 수정
- common-generator, fe-repo-generator 미호출
- **영향**: agent-notes/에 generator 작업 이력 없음

### 4. tester 검증 범위 부족
- 타입체크, 린트만 수행
- 실제 앱 실행 검증 누락
- DevTools 콘솔 에러 확인 안 함
- **리스크**: 수정이 실제 동작하는지 확신 부족 (사용자가 수동 확인함)

## 개선 아이디어

### 1. bug-analyzer에 다층 분석 전략 추가
- **현재**: 한 번에 하나의 원인만 분석
- **개선**: 초기 분석에서 여러 계층의 문제 동시 검토
  - **설정 레이어**: `webPreferences`, preload 경로, Electron 옵션
  - **코드 레이어**: preload 스크립트 구조, API 사용 정확성
  - **의존성 레이어**: 외부 라이브러리 사용 방식 (`@electron-toolkit/preload` 등)
- **효과**: 이번 사례처럼 3개 문제가 동시 존재할 때 한 번에 파악 가능

### 2. Electron API 검증 체크리스트
- **문제**: `process.contextIsolated`처럼 존재하지 않는 속성 사용
- **개선**: bug-analyzer가 Electron 공식 API 문서 기반 검증
  - 사용된 속성/메서드가 실제 존재하는지 확인
  - 버전별 변경 사항 체크 (Electron v37.7.1)
  - 대안 제시 (예: `process.contextIsolated` 대신 설정값 명시)
- **구현**: Electron API 레퍼런스 포함한 검증 단계 추가

### 3. structured clone 검증 단계
- **발견**: Proxy, EventEmitter 등 clone 불가 객체가 contextBridge 에러 유발
- **개선**: preload 스크립트 분석 시 자동 검증
  - `exposeInMainWorld`에 전달되는 객체 타입 확인
  - Proxy, EventEmitter, 함수 프로토타입 체인 감지
  - 명시적 함수 객체 권장
- **효과**: 3차, 4차 시행착오 방지

### 4. tester에 실행 검증 가이드 추가
- **현재**: 타입체크, 린트만 수행
- **개선**: bug-fix 워크플로우에서 실행 검증 체크리스트 제공
  ```
  ## 실행 검증 필요

  다음 항목을 사용자가 확인해주세요:

  1. 개발 모드 실행 (`pnpm dev`)
  2. DevTools 콘솔에서 `window.api` 존재 확인
  3. 저장 위치 선택 기능 동작 확인
  4. 콘솔 에러 메시지 없음 확인

  확인 완료 후 "검증 완료" 메시지를 입력해주세요.
  ```
- **방법**: tester가 검증 가이드 출력, 사용자 피드백 대기

### 5. 외부 라이브러리 사용 패턴 검증
- **발견**: `@electron-toolkit/preload`의 `electronAPI` 사용 시 문제
- **개선**: 라이브러리 사용 시 공식 문서 기반 검증
  - 예제 코드와 현재 사용 방식 비교
  - 불필요한 import 감지 (`electronAPI` 미사용)
  - 대안 제시
- **효과**: 라이브러리 오용 방지

### 6. 점진적 수정 vs 한 번에 수정 판단 기준
- **이번 케이스**: 4번의 시행착오 발생
- **개선**: 초기 분석 깊이 결정 기준
  - **단순 버그**: 빠른 수정 우선 (1-2회 시도)
  - **복합 버그**: 전체 분석 후 수정 (설정+코드+의존성 동시 검토)
- **판단 기준**:
  - 에러 메시지가 여러 레이어 언급 시 → 복합 버그
  - preload 관련 에러 → 설정+코드 동시 검토
  - 외부 라이브러리 관여 → 의존성 레이어 포함

### 7. 근본 원인 해결 후 리팩토링 단계 추가
- **발견**: 시행착오 중 추가한 불필요한 코드 (방어 코드, 기본값 명시)
- **개선**: bug-fix 완료 후 자동으로 리팩토링 검토
  - 시행착오 중 추가된 코드 목록화
  - 근본 원인 해결로 불필요해진 코드 식별
  - 프로젝트 일관성 검증 (다른 파일과 패턴 비교)
- **효과**: 최종 수정이 필수 변경만 포함, 코드베이스 품질 유지

## 최종 수정 내용 요약

### 1. preload/index.ts (필수)
- `process.contextIsolated` 조건문 제거 (존재하지 않는 속성)
- Proxy 객체 → 명시적 함수 객체 변경 (structured clone 가능하도록)
- `@electron-toolkit/preload`의 `electronAPI` import 제거
- `contextBridge.exposeInMainWorld('electron', electronAPI)` 제거

### 2. renderer/env.d.ts (필수)
- `ElectronAPI` import 제거
- `window.electron` 타입 선언 제거

### 3. 제거된 불필요한 코드 (리팩토링)
- **main/window/index.ts**: `contextIsolation: true` 제거 (Electron 기본값, 명시 불필요)
- **renderer/repo/app.ts**: `if (!window.api)` 방어 코드 4곳 제거
  - `isInitialized()`, `selectWorkspaceDirPath()`, `initializeApp()`, `syncApp()`
  - 시행착오 중 추가했으나 근본 원인 해결 후 불필요함
  - 프로젝트 전체에서 방어 코드 사용 안 함 (일관성 해침)
  - **교훈**: 시행착오 중 추가한 코드는 근본 원인 해결 후 재검토 필요

## 근본 원인

1. **`contextIsolation` 미설정**: preload 조건문이 제대로 동작하지 않음
2. **`process.contextIsolated` 존재하지 않음**: 조건문 항상 false
3. **Proxy 객체 structured clone 불가**: contextBridge 에러
4. **`electronAPI` structured clone 불가**: ipcRenderer 포함으로 인한 에러

→ 4개 문제가 계층적으로 얽혀 있었고, 모두 해결해야 동작함