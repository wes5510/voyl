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

## 공통 규칙

### 동일 위계 Import 규칙

- 동일 위계 내의 파일만 import 가능 (상위/하위 위계 불가)
- shared 폴더는 동일 또는 상위 위계에서만 접근 가능

#### 예시

```
page/
├── SideBar/
│   ├── index.tsx
│   ├── utils.ts
│   ├── shared/
│   │   └── helper.ts
│   └── Child/
│       └── index.tsx
├── TopBar/
│   ├── index.tsx
│   └── shared/
│       └── helper.ts
└── index.tsx
```

**일반 import:**
- ✅ `SideBar/index.tsx` → `SideBar/utils.ts` (동일 위계)
- ✅ `SideBar/index.tsx` → `TopBar/index.tsx` (동일 위계)
- ❌ `SideBar/index.tsx` → `SideBar/Child/index.tsx` (하위 위계)
- ❌ `SideBar/Child/index.tsx` → `SideBar/utils.ts` (상위 위계)

**shared import:**
- ✅ `SideBar/index.tsx` → `SideBar/shared/helper.ts` (동일 위계 shared)
- ✅ `SideBar/Child/index.tsx` → `SideBar/shared/helper.ts` (상위 위계 shared)
- ❌ `SideBar/index.tsx` → `TopBar/shared/helper.ts` (다른 위계 shared)
- ❌ `SideBar/index.tsx` → `SideBar/Child/shared/helper.ts` (하위 위계 shared)

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
