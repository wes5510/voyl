# 아키텍처

## 레이어

### Main Process (백엔드)
- `main/repo.md` - Repository 레이어 (파일시스템 + SQLite 캐시)
- `main/model.md` - 도메인 모델 및 비즈니스 로직
- `main/ipc.md` - IPC 핸들러
- `main/window.md` - 애플리케이션 윈도우 관리
- `main/common.md` - 공유 유틸리티

### Renderer Process (프론트엔드)
- `renderer/page.md` - UI 페이지 컴포넌트
- `renderer/state.md` - 상태 관리 (React Query + Zustand)
- `renderer/repo.md` - 데이터 페칭 (IPC 통신)
- `renderer/model.md` - 도메인 모델 및 비즈니스 로직
- `renderer/common.md` - 공유 UI 컴포넌트

## 의존성 규칙

### Main Process
- `common` -> 다른 모듈 import 불가
- `repo` -> `common` import 가능
- `model` -> `repo`, `common` import 가능
- `ipc` -> `model`, `common` import 가능
- `window` -> `common` import 가능

### Renderer Process
- `common` -> 다른 모듈 import 불가
- `repo` -> `common` import 가능
- `model` -> `common` import 가능
- `state` -> `repo`, `model`, `common` import 가능
- `page` -> `state`, `common` import 가능
