# @voyl/desktop

React와 TypeScript 기반의 Electron 데스크톱 애플리케이션

## 개발 환경 설정

### 설치

```bash
$ pnpm install
```

### 개발

```bash
$ pnpm dev
```

### 빌드

```bash
# Windows용
$ pnpm build:win

# macOS용
$ pnpm build:mac

# Linux용
$ pnpm build:linux
```

### 테스트

```bash
# 단위 테스트
$ pnpm test

# 커버리지 포함
$ pnpm coverage:unit
```

## 프로젝트 구조

```
src/
├── main/           # Electron 메인 프로세스 (Node.js 환경)
├── renderer/       # React 프론트엔드 (브라우저 환경)
└── preload/        # 프리로드 스크립트 (브릿지 역할)
```

## 기술 스택

### 핵심 기술

- **Electron** - 데스크톱 애플리케이션 프레임워크
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** + **electron-vite** - 빌드 도구

### 데이터베이스 & 상태관리

- **better-sqlite3** - SQLite 데이터베이스
- **drizzle-orm** - TypeScript ORM
- **zustand** - 상태 관리

### UI/UX

- **Tailwind CSS** - 스타일링
- **Shadcn UI** - 접근성 있는 UI 컴포넌트
- **Lucide React** - 아이콘
- **@dnd-kit** - 드래그 앤 드롭

### 개발 도구

- **ESLint** + **@voyl/eslint-plugin-voyl** - 코드 품질
- **Prettier** - 코드 포맷팅
- **Vitest** - 테스팅
- **electron-devtools-installer** - 디버깅

## 관련 문서

상세한 아키텍처 정보는 각 모듈의 README를 참고하세요:

- [메인 프로세스 구조](./src/main/README.md)
- [렌더러 프로세스 구조](./src/renderer/README.md)
