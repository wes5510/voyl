# 아키텍처

## 레이어

### Main Process (백엔드)
- `main/db.md` - 데이터베이스 레이어 (Drizzle ORM + better-sqlite3)
- `main/model.md` - 도메인 모델 및 비즈니스 로직
- `main/ipc.md` - IPC 핸들러
- `main/window.md` - 애플리케이션 윈도우 관리
- `main/common.md` - 공유 유틸리티 (참조용)

### Renderer Process (프론트엔드)
- `renderer/page.md` - UI 페이지 컴포넌트
- `renderer/store.md` - 상태 관리 (Zustand)
- `renderer/repo.md` - 데이터 페칭 (React Query)
- `renderer/common.md` - 공유 UI 컴포넌트 (참조용)

## 의존성 규칙

### Main Process
- `common` -> 다른 모듈 import 불가
- `db` -> `common` import 가능
- `model` -> `db`, `common` import 가능
- `ipc` -> `model`, `common` import 가능
- `window` -> `model`, `common` import 가능

### Renderer Process
- `common` -> 다른 모듈 import 불가
- `store`, `repo` -> `common` import 가능 (서로 독립)
- `page` -> `store`, `repo`, `common` import 가능
