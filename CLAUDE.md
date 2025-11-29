# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build the application
pnpm build

# Lint code
pnpm lint

# Type checking
pnpm typecheck

# Run tests
pnpm test

# Run tests with coverage
pnpm coverage:unit
```

### Desktop App Specific
```bash
# Build for specific platforms
pnpm build:win    # Windows
pnpm build:mac    # macOS  
pnpm build:linux  # Linux

# Format code
pnpm format

# Pre-commit checks
pnpm pre-commit
```

## Architecture Overview

Voyl is an Electron-based desktop productivity tool for hierarchical node management. The project follows a monorepo structure with strict architectural patterns.

### Core Structure
- **Monorepo**: Uses pnpm workspace with main app in `apps/desktop/`
- **Electron App**: React 19 + TypeScript + Vite stack
- **Data Storage**: Local file system as source of truth with SQLite cache
- **State Management**: Zustand + React Query for client state and server state

### Key Directories

자세한 레이어 구조 및 의존성 규칙은 [Layer Guide](apps/desktop/docs/guide/layer/index.md) 참조.

#### `/apps/desktop/src/main/` - Electron Main Process
- **repo/**: Repository 레이어 (파일시스템 + SQLite 캐시, Drizzle ORM)
- **model/**: 도메인 모델 및 비즈니스 로직
- **ipc/**: IPC 핸들러
- **window/**: 애플리케이션 윈도우 관리
- **common/**: 공유 유틸리티

#### `/apps/desktop/src/renderer/` - React Frontend
- **page/**: UI 페이지 컴포넌트
- **store/**: 상태 관리 (React Query + Zustand)
- **repo/**: 데이터 페칭 (IPC 통신)
- **model/**: 도메인 모델 및 비즈니스 로직
- **common/**: 공유 UI 컴포넌트

### Agent System

프로젝트는 Claude Code Agent 시스템을 사용합니다.
- Agent 정의: `.claude/agents/`
- 워크플로우: [orchestrator.md](.claude/agents/orchestrator.md) 참조

### Technology Stack
- **UI**: React 19, Tailwind CSS, Shadcn UI, Lucide icons
- **Data**: better-sqlite3, Drizzle ORM, React Query
- **State**: Zustand for local state
- **DX**: Vite, TypeScript, ESLint, Prettier, Vitest
- **Desktop**: Electron with electron-vite

### Data Architecture
- **Local Files**: Primary data storage in user-selected workspace directory
- **SQLite Cache**: Performance optimization for search/filtering
- **Node Structure**: Hierarchical tree with nodes stored as `.json` files
- **Content**: Long-form content in separate `.md` files

### Development Patterns
- **Plan-Act Mode**: All major changes require planning phase in `docs/planning/` before implementation
- **Module Independence**: Models cannot depend on each other
- **Type Safety**: Full TypeScript coverage with strict checking
- **Testing**: Unit tests with Vitest, testing library for React components

### Important Files
- **PRD**: `docs/PRD.md` - Product requirements and feature specifications
- **Workspace Structure**: User-defined directories with `nodes/`, `content/`, `log/` subdirectories
- **Settings**: App config in userData directory, workspace settings in user workspace

### Custom ESLint Rules
The project includes `@voyl/eslint-plugin-voyl` for enforcing architectural constraints and coding standards.