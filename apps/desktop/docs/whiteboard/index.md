# 화이트보드

진행 중인 논의, 아이디어, 맥락.

모든 Agent가 협업에 사용.

아이디어가 성숙하면 이동:
- `spec/` - 기술 명세
- `planning/` - 실행 계획

## 폴더명 컨벤션

- 형식: `{task-dir}` = `YYYYMMDDTHHMM-kebab-case-name/`
- 예시: `20251129T1245-user-auth/`
- Agent 파일들에서 `{task-dir}`로 참조

## 폴더 구조

```
whiteboard/
├── {task-dir}/                    # 예: 20251129T1245-user-auth/
│   ├── context.md
│   └── agent-notes/
│       ├── architect.md
│       └── spec-writer.md
```

### context.md
- 전체 맥락 요약
- 각 Agent가 알아야 할 정보
- 참조할 기존 문서 경로

### agent-notes/
- 각 Agent가 작성한 노트
- Agent 이름으로 파일 생성 (예: `architect.md`, `spec-writer.md`)
