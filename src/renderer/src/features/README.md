# Features Structure

_Read this in other languages: [한국어](README.ko.md)_

## Overview

Features is where domain functionality is implemented.
Each feature is composed as an independent domain unit.

## Structure

### Basic Structure

```
features/
└── [feature]/
    ├── model/           # Domain logic
    │   ├── index.ts     # External interface
    │   ├── store.ts     # State management
    │   └── types.ts     # Type definitions
    └── ui/              # UI components
        ├── index.tsx    # Main component
        └── Button/      # Internal component
```

### Components

#### 1. model/

- Contains domain model data structures and business logic
- `index.ts` exposes states and actions through store
- Domain logic is implemented as pure functions

#### 2. ui/

- Contains UI components that use the domain model
- Handles visualization of domain model and user interactions
- Manages UI-related logic

## Rules

### Import Rules

#### Allowed Imports

```typescript
// 1. Same Directory Imports
import { TreeNode } from './tree' // ✅ File in the same directory
import { TreeUtils } from './utils' // ✅ Utility in the same directory
import MainPanel from './MainPanel' // ✅ Component in the same directory

// 2. Shared Directory Imports
import Button from './shared/Button' // ✅ Shared at the same level

// 3. Domain Model Access through Store
import { useTreeStore } from '@/features/tree/model' // ✅ Access domain model through store
```

#### Forbidden Imports

```typescript
// 1. Different Level Import Restriction
import { PathNode } from '../path/model/node' // ❌ Different level
import BaseView from '../ui/BaseView' // ❌ Upper level

// 2. Shared Directory Restrictions
import SubButton from './shared/Button/Sub' // ❌ Shared subdirectory
import Button from '../shared/Button' // ❌ Shared from different level

// 3. Cross-Feature Import Restrictions
import { BEntity } from '@/features/B/model/domain' // ❌ Internal model from another feature
import { useBStore } from '@/features/B/model' // ❌ Store from another feature
import { BView } from '@/features/B/ui' // ❌ UI from another feature
```

## ESLint Rules

```javascript
{
  "rules": {
    "voyl/import-path-format": "error",    // Only allow permitted import paths
  }
}
```
