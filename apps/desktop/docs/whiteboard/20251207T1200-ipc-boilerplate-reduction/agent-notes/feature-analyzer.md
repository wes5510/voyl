# Feature Analyzer: IPC 보일러플레이트 최소화 분석

## 요구사항 요약

새 IPC 채널 추가 시 preload/index.ts에서 수동으로 함수를 정의해야 하는 보일러플레이트 제거.

**이전 시도**: Proxy 사용 → structured clone 제약으로 실패 → 명시적 함수 객체로 롤백

**현재 상태**:
- Main: handlers → ChannelApi 타입 자동 추출 → registerHandlers() 자동 등록 ✓
- Preload: 12개 채널을 수동으로 정의 (28줄) ✗
- Renderer: repo 레이어에서만 window.api 사용 (5개 파일, 캡슐화 완벽)

---

## 수집된 정보 종합

### web-researcher

**Structured Clone 제약 (우회 불가):**
- `contextBridge.exposeInMainWorld`는 보안(Context Isolation)을 위해 structured clone 알고리즘 사용
- Proxy, Function, Symbol, Getter/Setter 등 전달 불가 → `DataCloneError`
- 이는 보안을 위한 **필수 제약**이며 우회 불가능

**가능한 접근법 6가지 조사:**
1. **명시적 함수 객체 생성 (현재)** - Electron 공식 권장
2. **Codegen (빌드타임)** - ts-morph, TS Compiler API, 텍스트 파싱
3. **런타임 객체 생성** - reduce/Object.fromEntries 사용
4. **satisfies 연산자** - 타입 검증 강화
5. **Vite Plugin** - 빌드 프로세스 통합
6. **tRPC-Electron** - RPC 패러다임 전환

**결론:**
- 현재 채널 수(12개)에서는 **명시적 함수 객체 유지**가 최선
- Codegen 도입은 채널 50개 이상일 때 고려
- 타입 안전성 포기하는 접근법(런타임 객체 생성)은 권장 안 함

### code-researcher (미수행, 직접 확인)

**Main (자동화 완료):**
```typescript
// main/ipc/index.ts
const handlers = { ...appHandlers, ...treeHandlers, ... }
export type ChannelApi = { /* 타입 자동 추출 */ }
export function registerHandlers() { /* 자동 등록 */ }
```
- handlers 객체에서 ChannelApi 타입 자동 추출 ✓
- 파라미터 유무를 정확히 반영 (조건부 타입 사용) ✓
- 자동 등록 로직 구현 ✓

**Preload (수동 정의):**
```typescript
// preload/index.ts (28줄)
const api: ChannelApi = {
  'app.isInitialized': () => ipcRenderer.invoke('app.isInitialized'),
  'app.selectWorkspaceDirPath': () => ipcRenderer.invoke('app.selectWorkspaceDirPath'),
  // ... 12개 수동 정의
}
contextBridge.exposeInMainWorld('api', api)
```
- 각 채널마다 명시적 함수 정의 ✗
- TypeScript가 ChannelApi와 일치 검증 ✓

**Renderer (완벽한 캡슐화):**
- window.api는 repo 레이어에서만 사용 (5개 파일)
- 총 12회 호출
- Page/State 레이어는 repo를 통해 간접 호출

**새 채널 추가 시 수정 범위:**
1. `main/ipc/{domain}.ts` - 핸들러 추가
2. `preload/index.ts` - 함수 수동 정의
3. `renderer/repo/{domain}.ts` - repo 함수 작성

### doc-researcher (미수행, web-researcher에서 확인)

**이전 Proxy 실패 기록:**
- `whiteboard/20251207T1200-fix-save-location-error-toast/agent-notes/bug-analyzer-4.md`
- Proxy → structured clone 에러 → 명시적 함수 객체로 롤백
- 동일한 문제를 다시 시도하지 않도록 주의

---

## 영향 범위

### 변경 필요 레이어

**변경 없음**. 다음 중 하나를 선택:

#### 옵션 1: 현재 패턴 유지
- Preload: 그대로 유지

#### 옵션 2: Codegen 도입
- Build Script: `scripts/generate-preload.ts` 추가
- Package.json: prebuild 스크립트 수정
- Preload: 자동 생성 파일로 변경

### 의존성 영향

**옵션 1 (유지):**
- 영향 없음

**옵션 2 (Codegen):**
- `ts-morph` 의존성 추가
- 빌드 프로세스 복잡도 증가
- 생성 스크립트 유지보수 필요

---

## 구현 전략

### 전략 비교

| 관점 | 옵션 1: 현재 패턴 유지 | 옵션 2: ts-morph Codegen 도입 |
|------|------------------------|------------------------------|
| **타입 안전성** | ⭐⭐⭐⭐⭐ (완벽) | ⭐⭐⭐⭐⭐ (완벽) |
| **보일러플레이트** | ⭐⭐ (28줄 수동) | ⭐⭐⭐⭐⭐ (자동 생성) |
| **복잡도** | ⭐⭐⭐⭐⭐ (단순) | ⭐⭐ (스크립트 관리) |
| **유지보수성** | ⭐⭐⭐⭐ (명확) | ⭐⭐⭐ (생성 로직 이해 필요) |
| **초기 비용** | 없음 | 2-3시간 (스크립트 작성) |
| **장기 비용** | 채널 추가 시마다 1분 | 스크립트 유지보수 |
| **ROI** | N/A | 낮음 (12개 → 50개 넘어야 회수) |

### 권장 전략: **옵션 1 (현재 패턴 유지)**

**핵심 근거:**
1. **규모 대비 적절성**: 12개 채널은 관리 가능한 수준 (28줄)
2. **Electron 공식 권장**: 명시적 함수 객체가 표준 패턴
3. **타입 안전성**: 현재도 완벽한 타입 검증
4. **명확성**: Codegen보다 디버깅 쉬움
5. **안정성**: 추가 의존성 없음

**새 채널 추가 작업 시간:**
- 현재: 3곳 수정 × 30초 = 1.5분
- Codegen: 2곳 수정 + 스크립트 실행 = 1분
- **절약 시간**: 30초/채널

**Codegen 투자 회수 시점:**
- 초기 구축: 2-3시간 (120-180분)
- 회수 필요 채널 수: 180분 / 0.5분 = **360개 채널**
- 현실적으로 도달 불가능

**채널이 언제 늘어날까?**
- 현재 도메인: app(4), tree(3), node(1), favorite(1), treeView(2)
- 예상 증가: 연 5-10개 추가
- 50개 도달: 4-8년 후

### 향후 재검토 기준

**Codegen 도입 고려 시점:**
- 채널 수가 50개 이상
- 수동 관리가 반복적 실수 유발
- 팀 규모 증가로 여러 명이 동시에 IPC 추가

---

## 구현 순서

**작업 불필요**. 현재 패턴 유지.

### 사용자 확인 필요 사항

없음. 분석 결과를 사용자에게 보고.

---

## 주의사항

1. **Proxy 재시도 금지**: structured clone 제약은 우회 불가능
2. **타입 안전성 포기 금지**: 런타임 객체 생성 방식은 버그 유발 가능성
3. **과도한 엔지니어링 경계**: 현재 규모에서 Codegen은 과도
4. **문서 업데이트**: 이 분석 결과를 의사결정 문서에 기록

---

## Needs User Decision

**결정 필요:** 현재 패턴 유지 vs Codegen 도입

**옵션:**

### 1. 현재 패턴 유지 (권장)
**장점:**
- 안정적, Electron 공식 권장
- 타입 안전성 완벽
- 추가 의존성 없음
- 코드 명확, 디버깅 쉬움

**단점:**
- 새 채널 추가 시 preload 수동 수정 (28줄 → 30줄, 1분 소요)

**적합한 경우:**
- 현재처럼 채널이 12개 수준
- 팀이 작고 변경이 빈번하지 않음
- 안정성과 명확성 우선

### 2. ts-morph 기반 Codegen 도입
**장점:**
- 완전 자동화 (preload 수정 불필요)
- 타입 안전성 유지

**단점:**
- 초기 구축 비용: 2-3시간
- ts-morph 의존성 추가
- 빌드 스크립트 유지보수 필요
- 생성 로직 이해 필요
- ROI가 극히 낮음 (360개 채널 필요)

**적합한 경우:**
- 채널이 50개 이상
- 빈번한 IPC 추가
- 팀 규모가 큼

### 3. 나중에 다시 검토
**장점:**
- 지금 결정 보류
- 채널 증가 추이 관찰 후 판단

**단점:**
- 동일한 논의 반복 가능성

---

**권장:** **옵션 1 (현재 패턴 유지)**

**이유:**
1. 12개 채널은 관리 가능
2. Electron 공식 권장 방식
3. Codegen ROI 극히 낮음 (360개 채널 필요)
4. 향후 50개 넘으면 재검토 가능

**대안:**
- 옵션 3 선택 시 **재검토 기준** 명시:
  - 채널 50개 도달
  - 또는 수동 관리로 인한 반복적 실수 발생

---

## 완료 상태

**사용자 확인 필요**

분석 결과와 3가지 옵션을 제시했으니, 사용자가 최종 결정해야 함.

권장은 **옵션 1 (현재 패턴 유지)**이지만, 사용자가 "보일러플레이트 완전 제거"를 강하게 원한다면 옵션 2 선택 가능.
