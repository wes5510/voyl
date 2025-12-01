# 계획

앞으로 할 작업에 대한 계획 및 할 일.

작성자: planner agent

## 파일명 컨벤션

- 형식: `{task-dir}.md` = `YYYYMMDDTHHMM-kebab-case-name.md`
- 예시: `20251129T1245-feature-planning.md`
- Agent 파일들에서 `{task-dir}`로 참조

## 계획 문서 템플릿

```markdown
# {작업명}

## 작업 목표
{달성하려는 목표}

## 영향 범위
- 레이어: {영향 받는 레이어 목록}
- 파일: {주요 파일 목록}

## 실행 계획

### Phase 1 (직렬)
1. **{agent-name}** - {작업 설명}
   - 의존성: 없음

### Phase 2 (병렬)
동시 실행 가능:
- **{agent-name}** - {작업 설명}
  - 의존성: Phase 1 완료
- **{agent-name}** - {작업 설명}
  - 의존성: Phase 1 완료

### Phase N (직렬)
1. **tester** - 검증

## Agent별 상세 작업

### {agent-name}
- 파일: {수정할 파일}
- 작업: {구체적 작업 내용}
- 산출물: {예상 결과물}

## 검증 기준
- [ ] 타입체크 통과
- [ ] 린트 통과
- [ ] 테스트 통과
```

**핵심**: Phase별로 병렬/직렬을 명시하여 오케스트레이터가 실행 방식을 판단할 수 있게 함

## 계획 목록

- [20251129T1430-ipc-boilerplate-removal.md](./20251129T1430-ipc-boilerplate-removal.md) - IPC 보일러플레이트 제거 계획
- [20251201T2120-focus-previous-node-on-delete.md](./20251201T2120-focus-previous-node-on-delete.md) - 노드 삭제 시 이전 노드로 포커스 이동 계획
