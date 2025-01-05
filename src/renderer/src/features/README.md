# Features Directory Structure

_Read this in other languages: [한국어](README.ko.md)_

## Overview

This document explains the structure and rules of the `features/` directory. We pursue two core principles:

- **High Cohesion**: Manage related files together in one directory
- **Low Coupling**: Minimize dependencies between components through clear interfaces

## Directory Structure

### Basic Structure

The project follows this structure:

```
features/
└── tree/                 # Domain unit
    ├── model/           # Domain model
    │   ├── index.ts    # Store (states and actions)
    │   └── tree/       # Domain logic
    │       ├── index.ts
    │       └── node.ts
    └── ui/             # UI components
        ├── shared/     # Shared UI components
        └── MainPanel/  # Component implementation
```

### Main Directories

#### 1. model/

- Contains domain model data structures and business logic
- `index.ts` exposes states and actions through store
- Domain logic is implemented as pure functions

#### 2. ui/

- Contains UI components that use the domain model
- Handles visualization of domain model and user interactions
- Manages UI-related logic

## Import Rules

Follow these rules for clear dependency management:

### Allowed Imports

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

### Forbidden Imports

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

These rules are automatically enforced by the following ESLint configuration:

```javascript
{
  "rules": {
    "voyl/import-path-format": "error",    // Only allow permitted import paths
  }
}
```
