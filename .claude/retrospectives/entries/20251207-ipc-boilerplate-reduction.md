# 회고: IPC 보일러플레이트 최소화

- **일시**: 2025-12-07
- **워크플로우**: 기능 개선 (Feature Enhancement)
- **결과**: 성공 (3차 개선까지 완료)

## 작업 목표

새 IPC 채널 추가 시 preload/index.ts에서 수동으로 함수를 정의해야 하는 보일러플레이트 제거.

**최종 결과**:
- 12개 수동 함수 정의 → 동적 생성 로직
- 새 채널 추가 시 preload 수정 불필요
- 네이밍/구조 정리 완료 (CHANNELS + Channel)

**최종 구조**:
```
common/channel.ts          # CHANNELS (배열) + Channel (타입)
main/ipc/index.ts          # ChannelApi + handlers + 타입 검증
preload/index.ts           # CHANNELS + ChannelApi로 동적 API 생성
renderer/env.d.ts          # ChannelApi 타입 참조
```

## 호출된 Agent

### 1차 시도 (실패)
1. **research-planner**: 리서치 계획 수립
2. **web-researcher** (2회): Electron contextBridge structured clone 제약, 보일러플레이트 해결 패턴 조사
3. **code-researcher**: renderer에서 window.api 사용 패턴 분석 (계획만, 미실행)
4. **doc-researcher**: 이전 Proxy 실패 기록 확인 (계획만, 미실행)
5. **feature-analyzer**: "현재 패턴 유지" 권장 (보수적 결론)

### 2차 시도 (성공)
1. **bug-analyzer**: 근본 원인 분석 - preload에서 main-only 모듈 간접 import 문제
2. **planner**: (호출 기록 누락 - whiteboard에 없음)
3. **be-ipc-generator**: channel-names.ts 분리, import 경로 수정
4. **tester**: 타입체크, 린트, 빌드 검증 통과

### 3차 개선 (리팩토링)
1. **사용자 피드백**: "common에 넣고 파일명 camelCase로"
   - main/ipc/channel-names.ts → common/channelNames.ts 이동
2. **사용자 피드백**: "channelNames vs ChannelKeys 헷갈림"
   - channels + Channel로 네이밍 정리
3. **사용자 피드백**: "const는 UPPER_CASE"
   - 최종: CHANNELS (배열) + Channel (타입)
4. **정리**: 사용 안 하는 타입/export 제거

## 워크플로우 전개

### 1차 시도: 보수적 분석으로 실패

**진행 과정**:
1. research-planner가 4개 리서처 병렬 호출 계획 수립
2. web-researcher 2회 실행 (Electron 제약, 보일러플레이트 해결 패턴)
3. feature-analyzer 분석:
   - Structured clone 제약 확인
   - Codegen vs 현재 패턴 비교
   - **결론**: "채널 12개는 관리 가능, 현재 패턴 유지 권장"
   - ROI 계산: Codegen 투자 회수에 360개 채널 필요

**실패 원인**:
- "불가능" 결론에 너무 빠르게 도달
- 더 간단한 대안(동적 함수 객체 생성) 탐색 부족
- Proxy vs plain 함수 객체 구분 실패

### 사용자 피드백: "preload만 개선하면 안 되나?"

**전환점**:
- 사용자가 더 좁은 범위 개선 제안
- 오케스트레이터가 추가 검증:
  - Proxy 아닌 plain 함수 객체는 structured clone 통과
  - `Object.fromEntries(channelNames.map(...))` 패턴 가능

### 구현 시도: 런타임 에러 발생

**구현 내용**:
- main/ipc/index.ts에서 `channelNames` export
- preload/index.ts에서 import하여 동적 함수 객체 생성

**런타임 에러**:
```
SyntaxError: The requested module 'electron' does not provide an export named 'BrowserWindow'
Failed to check initialization status: TypeError: Cannot read properties of undefined
```

**문제**:
- preload에서 `main/ipc/index.ts` import
- → main/ipc/index.ts가 top-level에서 `ipcMain` import
- → preload는 renderer context라서 main-only 모듈 사용 불가
- → 모듈 로딩 실패

### 2차 시도: 근본 원인 분석 및 해결

**bug-analyzer 분석**:
- 근본 원인: preload가 main-only 모듈을 **간접** import
- 구조적 문제: main/ipc/index.ts가 두 가지 역할 혼재
  1. Main용: handlers 등록 (ipcMain 사용)
  2. 타입 제공: ChannelApi, channelNames export

**수정 전략**:
- `main/ipc/channel-names.ts` 별도 파일 생성
- 순수 채널 목록만 export (main-only 의존성 없음)
- main/ipc/index.ts는 re-export만
- preload는 channel-names.ts에서 import

**2차 구조**:
```
main/ipc/
├── channel-names.ts  # 순수 채널 목록
├── index.ts          # handlers, 타입, channelNames re-export
└── app.ts, tree.ts, ... # 핸들러 정의

preload/
└── index.ts          # channel-names.ts에서 import
```

**검증 결과**: 타입체크, 린트, 빌드 모두 통과

### 3차 개선: 점진적 리팩토링으로 최종 구조 도출

**진행 과정**:
1. **위치 이동**: channel-names.ts → common/channelNames.ts
   - main 전용이 아닌 공통 정의로 인식
   - camelCase로 파일명 컨벤션 통일

2. **네이밍 정리**: channelNames/ChannelKeys → channels/Channel
   - "Keys"는 키만 의미, "Channel"이 더 명확
   - 일관성: 배열명(복수) + 타입명(단수)

3. **대문자 컨벤션**: channels → CHANNELS
   - 상수는 UPPER_CASE (프로젝트 규칙)
   - 타입은 PascalCase (Channel)

4. **정리**: 사용 안 하는 타입 제거
   - ChannelKeys 제거 (Channel로 통합)
   - 불필요한 export 제거

**최종 구조**:
```
common/channel.ts          # CHANNELS + Channel (main-only 의존성 없음)
main/ipc/index.ts          # ChannelApi + Channel import만
preload/index.ts           # CHANNELS + ChannelApi import
renderer/env.d.ts          # ChannelApi 타입 참조
```

**핵심 변화**:
- main/ipc에서 Channel 타입만 import (런타임 값 import 없음)
- CHANNELS는 common에서 직접 가져옴
- 명확한 네이밍 컨벤션

## 잘된 점

1. **사용자 피드백이 핵심 돌파구**:
   - "preload만 개선하면?" → 동적 함수 객체 방식 발견
   - "common에 넣자" → 더 명확한 구조
   - "네이밍 헷갈림" → 일관된 컨벤션 확립

2. **정확한 근본 원인 분석**: bug-analyzer가 간접 import 문제 정확히 파악

3. **점진적 개선**: 3차에 걸쳐 점진적으로 더 나은 구조 도출

4. **타입 안전성 유지**: 동적 생성하면서도 ChannelApi 타입 검증 완벽

## 문제점

1. **초기 분석 부족**:
   - feature-analyzer가 너무 보수적으로 접근
   - Proxy vs plain 함수 객체 구분 실패
   - 대안 탐색 부족 (Codegen vs 현재 패턴만 비교)
   - **근본 원인**: "불가능" 결론에 너무 빠르게 도달

2. **Electron 환경 이해 부족**:
   - preload context에서 main 모듈 import 제약 사전 파악 실패
   - "빌드 성공 = 런타임 성공" 착각
   - 간접 의존성 체인 분석 미흡
   - **결과**: 런타임 에러로 이어짐

3. **code-researcher 검증 오류**:
   - "preload에서 main import 가능"이라고 잘못 판단
   - 타입 import vs 값 import 구분 실패
   - **교훈**: 리서처 결과도 검증 필요

4. **네이밍 일관성 부족**:
   - 초기에 channelNames/ChannelKeys로 혼란 유발
   - UPPER_CASE 컨벤션 처음부터 적용 못함
   - **교훈**: 네이밍 컨벤션은 초기부터 명확히

5. **planner 호출 누락**:
   - whiteboard에 planner agent-notes 없음
   - 오케스트레이터가 직접 구현 지시했을 가능성
   - **워크플로우 규칙 위반**

## 개선 아이디어

### 1. feature-analyzer 개선
- "불가능" 결론 전 대안 탐색 체크리스트 추가
- 보수적 결론 시 "사용자에게 더 좁은 범위 개선 가능성 확인" 추천

### 2. Electron 전용 검증 추가
- preload context 제약 체크리스트:
  - [ ] main-only 모듈 직접 import 없는가?
  - [ ] 간접 import 체인에 main-only 모듈 없는가?
  - [ ] 타입 import vs 값 import 구분했는가?
- code-researcher에 Electron 환경별 검증 추가

### 3. 런타임 검증 강화
- tester Agent에 실제 앱 실행 검증 추가
- 빌드 성공 후 `pnpm dev` 실행하여 런타임 에러 확인
- 현재는 타입체크, 린트, 빌드만 검증

### 4. 워크플로우 준수 강화
- planner 호출 필수 규칙 재확인
- 오케스트레이터가 직접 구현 지시하지 않도록
- whiteboard에 모든 Agent 호출 기록 강제

## 핵심 교훈

1. **"불가능" 결론 전 대안 탐색 더 철저히**: Proxy 안 된다고 포기하지 말고, plain 함수 객체 등 대안 검토

2. **사용자 피드백이 핵심 돌파구**: 전문가도 놓치는 관점을 제공할 수 있음

3. **Electron process context 이해 필수**: preload는 renderer context (main-only 모듈 import 불가)

4. **빌드 성공 ≠ 런타임 성공**: 실제 앱 실행 검증 필요

5. **네이밍 컨벤션은 처음부터 명확히**:
   - const는 UPPER_CASE
   - 타입은 PascalCase
   - 초기 혼란 방지

6. **점진적 개선의 가치**: 완벽한 해답을 처음부터 찾으려 하지 말고, 피드백으로 개선

## 메트릭

- **1차 시도 소요 시간**: 약 30분 (리서치 + 분석)
- **2차 시도 소요 시간**: 약 15분 (분석 + 구현 + 검증)
- **3차 개선 소요 시간**: 약 20분 (점진적 리팩토링)
- **총 Agent 호출**: 9회 (1-2차) + 수동 리팩토링 (3차)
- **최종 코드 변경 범위**:
  - 파일 추가: 1개 (common/channel.ts)
  - 파일 수정: 3개 (main/ipc/index.ts, preload/index.ts, common/channel.type.ts 제거)
- **보일러플레이트 감소**: 12개 수동 함수 정의 → 동적 생성 로직

## 후속 작업

- [x] ~~channel-names.ts → common/channel.ts 이동~~ (3차 완료)
- [x] ~~네이밍 정리 (CHANNELS + Channel)~~ (3차 완료)
- [ ] 새 채널 추가 시 common/channel.ts의 CHANNELS 배열 수정 필요 (수동)
- [ ] CHANNELS와 handlers 불일치 시 컴파일 타임 검증 추가 (선택)
- [ ] Electron preload 제약 관련 문서 업데이트