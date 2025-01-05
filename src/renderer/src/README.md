# Project Structure

_Read this in other languages: [한국어](./README.ko.md)_

## Overview

The project consists of pages, features, and shared directories.
Each directory has clear responsibilities and rules to increase cohesion and decrease coupling.

## Structure

### Basic Structure

```
src/renderer/src/
├── pages/          # Page components
├── features/       # Domain features
│   └── [feature]/
│       ├── model/  # Domain logic
│       └── ui/     # UI components
└── shared/         # Common code
```

### Components

#### pages

- Components for each page
- Compose pages using features
- Can import from features and shared

#### features

- Implements domain functionality
- Each feature is an independent domain unit
- Cannot have dependencies on other features
- Can import from shared

#### shared

- Reusable common code
- UI components, utility functions, etc.
- Cannot import from other directories

## Rules

### Import Rules

#### Basic Rule

All files under `src/renderer/src` can only import from the same hierarchy.

```typescript
// ✅ Allowed: Import from same directory
import { Button } from './Button'
import { Icon } from './Icon'

// ✅ Allowed: Import from direct child directory
import { SubComponent } from './SubComponent/index'

// ❌ Forbidden: Import from different hierarchy
import { Something } from '../other/Something'
import { DeepComponent } from './Deep/More/Component'
```

#### Interface Rule

The following paths are accessible from outside:

- `/features/*/model/index.ts`: Single entry point exposing feature's model
- `/features/*/ui/*`: Direct files under feature's ui directory
- `/shared/*`: Direct directories under shared

#### Exception Rules

1. `/pages` can import from:

   - `/features/*/ui/*`
   - `/shared/*`

2. `/features/*/ui` can import from:
   - Its own `/features/*/model/index.ts`
   - `/shared/*`

## Related Documentation

- [Features Structure](./features/README.md)
- [Pages Structure](./pages/README.md)
