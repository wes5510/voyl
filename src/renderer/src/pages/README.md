# Pages Structure

_Read this in other languages: [한국어](README.ko.md)_

## Overview

This document explains the structure and rules of the `pages/` directory. We pursue two core principles:

- **High Cohesion**: Related files are managed together in a single directory
- **Low Coupling**: Component dependencies are minimized through clear interfaces

## Structure

### Basic Structure

The project follows this hierarchical structure:

```
pages/
├── shared/              # Top-level shared components
├── products/           # /products page
│   ├── shared/        # Products page shared components
│   ├── list/          # /products/list page
│   │   ├── shared/   # List page shared components
│   │   └── index.tsx
│   └── [id]/          # /products/:id page
└── index.tsx          # Root page (/)
```

### Components

#### 1. shared/

- Contains shared components, types, utility functions, and constants
- Access restricted to same and lower hierarchies only
- Can be placed in any page or component folder

#### 2. Page Directory

- Directory structure maps 1:1 with URL structure
- Each page contains an `index.tsx` handling its view and logic
- Dynamic routing expressed in `[parameter]` format

#### 3. Component Structure

Each component groups related files together to increase cohesion:

```
ComponentName/
├── shared/         # Component's internal shared elements
├── index.tsx      # Component implementation
├── types.ts       # Type definitions
├── utils.ts       # Utility functions
└── const.ts       # Constants
```

## Import Rules

### voyl/same-hierarchy-import

```typescript
// Same hierarchy imports
import { ProductList } from './ProductList' // ✅ Files/folders in same directory
import { types } from './types' // ✅ Files in same directory

import { Something } from '../other/Something' // ❌ Different hierarchy
import { Deep } from './deep/nested/Component' // ❌ Deep nested path

// shared import
import { SharedButton } from '@/pages/shared/Button' // ✅ Upper hierarchy shared
import { ListItem } from './shared/ListItem' // ✅ Same hierarchy shared

import { Sub } from './shared/Button/Sub' // ❌ shared subdirectory
import { Other } from '../shared/Other' // ❌ Different hierarchy shared (except upper)
import { Button } from './products/shared/Button' // ❌ Lower hierarchy shared
```

### voyl/feature-ui-interface-only

```typescript
import { TreeView } from '@/features/tree/ui/TreeView' // ✅ Direct files in feature ui
import { FirstPointLink } from '@/features/path/ui/Path' // ✅ Direct folders in feature ui

import { FirstPointLink } from '@/features/path/ui/Path/SecondPointLink' // ❌ Deep nested paths in feature ui
```

### voyl/feature-model-index-import-only

```typescript
import { useTreeStore } from '@/features/tree/model' // ✅ Single entry point of feature model

import { useTreeStore } from '@/features/tree/model/node' // ❌ Deep nested paths in feature model
```
