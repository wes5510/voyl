# 화이트보드

진행 중인 논의, 아이디어, 맥락.

모든 Agent가 협업에 사용.

## 폴더명 컨벤션

- 형식: `{task-dir}` = `YYYYMMDDTHHMM-kebab-case-name/`
- 예시: `20251129T1245-user-auth/`
- Agent 파일들에서 `{task-dir}`로 참조

## 폴더 구조

```
whiteboard/
├── {task-dir}/
│   ├── context.md           # 오케스트레이터가 생성
│   ├── decisions.md         # 설계 결정 기록 (ADR)
│   └── agent-notes/
│       ├── researcher.md    # 정보 수집 결과
│       ├── analyzer.md      # 분석 결과
│       ├── planner.md       # 실행 계획
│       └── ...
```

### context.md

오케스트레이터가 작업 시작 시 반드시 생성.

**템플릿:**
```markdown
# Context: {작업명}

## 작업 배경
{사용자가 요청한 이유, 해결하려는 문제}

## 목표
{달성하려는 구체적 목표}

## 제약사항
- 아키텍처: {레이어 의존성, 모듈 독립성 등}
- 기술: {사용할 라이브러리, 패턴 등}

## 의사결정
{설계 옵션과 선택 근거 - analyzer 결과 반영}
```

### decisions.md

설계 결정 기록 (ADR 패턴).

**템플릿:**
```markdown
# Decisions: {작업명}

설계 결정과 근거를 기록합니다.

## ADR-001: {결정 제목}

### 상태
Accepted | Proposed | Deprecated

### 맥락
{왜 이 결정이 필요한지}

### 결정
{무엇을 결정했는지}

### 근거
- {이유 1}
- {이유 2}

### 대안
| 대안 | 장점 | 단점 | 선택 |
|------|------|------|------|
| {대안 1} | {장점} | {단점} | ❌ |
| {대안 2} | {장점} | {단점} | ✅ |

### 결과
{이 결정으로 인한 영향}
```

### agent-notes/

각 Agent가 작성한 노트. Agent 이름으로 파일 생성.

| 파일 | 작성 Agent | 내용 |
|------|------------|------|
| `researcher.md` | researcher | 정보 수집 결과 |
| `analyzer.md` | analyzer | 분석 결과 |
| `planner.md` | planner | 실행 계획 |
| `tester.md` | tester | 검증 결과 |

## 작업 목록

- [20251129T2009-ipc-boilerplate-removal](./20251129T2009-ipc-boilerplate-removal/) - IPC 보일러플레이트 제거
- [20251129T2011-react-compiler-setup](./20251129T2011-react-compiler-setup/) - React Compiler 설정
- [20251130T0201-zustand-to-valtio-migration](./20251130T0201-zustand-to-valtio-migration/) - Zustand에서 Valtio로 마이그레이션
- [20251130T1630-logger-source-location](./20251130T1630-logger-source-location/) - 로거에 소스 위치 추가
- [20251201T2120-focus-previous-node-on-delete](./20251201T2120-focus-previous-node-on-delete/) - 노드 삭제 시 이전 노드로 포커스 이동
- [20251207T1200-fix-save-location-error-toast](./20251207T1200-fix-save-location-error-toast/) - 저장 위치 에러 수정
- [20251207T1200-ipc-boilerplate-reduction](./20251207T1200-ipc-boilerplate-reduction/) - IPC 보일러플레이트 최소화
