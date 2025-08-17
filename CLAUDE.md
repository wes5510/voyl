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

#### `/apps/desktop/src/main/` - Electron Main Process
- **db/**: Database schemas using Drizzle ORM + better-sqlite3
- **models/**: Domain models and business logic
- **ipc/**: Inter-process communication handlers
- **windows/**: Application window management
- **common/**: Shared utilities (no external dependencies)

**Dependency Rules**:
- `common` → no imports from other modules
- `db` → can import `common`
- `models` → can import `db`, `common`
- `ipc` → can import `models`, `common`
- `windows` → can import `models`, `common`

#### `/apps/desktop/src/renderer/` - React Frontend
- **pages/**: UI page components
- **models/**: Frontend domain models and business logic
- **common/**: Shared UI components and utilities

**Dependency Rules**:
- `common` → no imports from other modules
- `models` → can import `common` (each model is independent)
- `pages` → can import `models`, `common`

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