# 저장 위치 선택 에러 토스트 수정

**작성일**: 2025-12-07
**작성자**: Planner Agent

## 작업 목표

`preload/index.ts`의 잘못된 contextIsolation 체크로 인한 API 노출 실패 수정.

### 문제 상황
- `process.contextIsolated` 속성은 Electron에 존재하지 않음
- 항상 false로 평가되어 else 블록(`window.api = api`)이 실행되려 하지만
- `contextIsolation: true` 설정으로 인해 window 직접 수정 불가
- 결과: renderer에서 `window.api`가 undefined

## 영향 범위

### Backend (Main Process)
- **파일**: `/apps/desktop/src/preload/index.ts`
- **레이어**: Preload Script (Main/Renderer 브릿지)

## 실행 계획

### Phase 1 (직렬)
1. **common-generator** - Preload 스크립트 수정
   - 의존성: 없음
   - 작업: 조건문 제거, contextBridge 직접 사용

2. **tester** - 검증
   - 의존성: Phase 1 완료
   - 작업: 빌드, 런타임 테스트

## Agent별 상세 작업

### common-generator
**파일**: `/apps/desktop/src/preload/index.ts`

#### 작업 내용

현재 코드 (15-27행):
```typescript
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI
  // @ts-expect-error (define in dts)
  window.api = api
}
```

수정 후:
```typescript
contextBridge.exposeInMainWorld('electron', electronAPI)
contextBridge.exposeInMainWorld('api', api)
```

#### 근거
1. **설정 확인**: `electron.vite.config.ts`에서 preload 빌드 설정이 존재하고, Electron 기본값으로 `contextIsolation: true`가 적용됨
2. **표준 패턴**: Electron 공식 문서 및 `@electron-toolkit/preload` 예제에서 contextBridge 사용 권장
3. **에러 원인**: `process.contextIsolated`는 존재하지 않는 속성 (정확한 속성은 런타임에만 확인 가능하며 일반적으로 직접 체크하지 않음)
4. **결론**: contextIsolation이 활성화된 환경에서는 항상 contextBridge를 사용해야 함

#### 산출물
- 수정된 `/apps/desktop/src/preload/index.ts`

---

### tester
**작업**: 타입체크, 빌드, 런타임 테스트

#### 검증 항목

##### 컴파일 타임
- TypeScript 타입 체크 통과 (`pnpm typecheck`)
- ESLint 통과 (`pnpm lint`)
- Preload 스크립트 빌드 성공 (`pnpm build`)

##### 런타임 테스트 시나리오
1. **앱 실행**
   - 앱이 정상 실행되는지 확인

2. **저장 위치 선택 기능**
   - "저장 위치 선택" 버튼 클릭
   - 파일 다이얼로그가 정상 표시되는지 확인
   - 위치 선택 후 에러 토스트가 발생하지 않는지 확인

3. **개발자 도구 콘솔**
   - `window.api` 객체가 정의되어 있는지 확인
   - `window.electron` 객체가 정의되어 있는지 확인
   - 관련 에러 로그가 없는지 확인

#### 산출물
- 테스트 결과 보고

---

## 예상 산출물

1. **Preload Script**: `/apps/desktop/src/preload/index.ts` - 조건문 제거, contextBridge 직접 사용

---

## 리스크 및 대응

### 리스크 1: contextIsolation 설정 확인 필요
**문제**: contextIsolation이 실제로 활성화되어 있는지 명시적으로 확인되지 않음

**대응**:
- Electron 기본값이 true이므로 문제 없음
- 필요시 `main/window/index.ts`에서 webPreferences 확인 가능
- 런타임 테스트로 검증

### 리스크 2: 다른 preload 관련 코드 존재 가능
**문제**: 다른 곳에서 process.contextIsolated 사용 여부 미확인

**대응**:
- Grep으로 확인한 결과 `preload/index.ts`만 contextBridge 사용
- 다른 파일 없음

---

## 검증 기준

- [ ] `pnpm typecheck` 통과
- [ ] `pnpm lint` 통과
- [ ] 앱 실행 성공
- [ ] 저장 위치 선택 기능 정상 동작
- [ ] `window.api` 객체 정의 확인

---

## 다음 단계

1. Orchestrator에게 보고
2. **common-generator** 실행 요청
3. **tester**로 검증
