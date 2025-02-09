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

## Import Rules

### features

#### voyl/feature-model-index-import-only

```typescript
// @/features/tree/ui/TreeView.tsx
import useTreeStore from '@/features/tree/model' // ✅ Same feature file

import usePathStore from '@/features/path/model' // ❌ Different feature file
```

#### voyl/no-pages-import

```typescript
import { TreeView } from '@/pages/tree/ui' // ❌ Pages layer file
```

### model/

#### voyl/same-hierarchy-import

```typescript
// Same hierarchy imports
import { ProductList } from './ProductList' // ✅ Files/folders in same directory
import { types } from './types' // ✅ Files in same directory

import { Something } from '../other/Something' // ❌ Different hierarchy
import { Deep } from './deep/nested/Component' // ❌ Deep nested path
```

### ui/

#### voyl/same-hierarchy-import

```typescript
// Same hierarchy imports
import { ProductList } from './ProductList' // ✅ Files/folders in same directory
import { types } from './types' // ✅ Files in same directory

import { Something } from '../other/Something' // ❌ Different hierarchy
import { Deep } from './deep/nested/Component' // ❌ Deep nested path

// Shared imports
import { SharedButton } from '@/features/tree/ui/shared/Button' // ✅ Upper hierarchy shared
import { ListItem } from './shared/ListItem' // ✅ Same hierarchy shared

import { Sub } from './shared/Button/Sub' // ❌ Shared subdirectory
import { Other } from '../shared/Other' // ❌ Different hierarchy shared (except upper)
import { Button } from './products/shared/Button' // ❌ Lower hierarchy shared
```

#### voyl/feature-model-index-import-only

```typescript
import { useTreeStore } from '@/features/tree/model' // ✅ Single entry point of feature model

import { useTreeStore } from '@/features/tree/model/node' // ❌ Deep nested paths in feature model
```
