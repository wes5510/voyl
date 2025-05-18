# Pages Structure

_Read this in other languages: [한국어](README.ko.md)_

## Overview

The Pages layer composes UI components and user interfaces for the application.
It provides intuitive page organization through a directory structure that maps 1:1 with the URL structure.

## Structure

### Basic Structure

```
pages/
├── shared/              # Top-level shared components
├── products/            # /products page
│   ├── shared/          # Shared components for products page
│   ├── list/            # /products/list page
│   │   ├── shared/      # Shared components for list page
│   │   └── index.tsx
│   └── [id]/            # /products/:id page
└── index.tsx            # Root page (/)
```

### Components

#### 1. shared/

- Contains shared components, types, utility functions, and constants
- Can only be accessed from the same or higher hierarchies
- Can be placed anywhere within page/component folders

#### 2. Page Directories

- Directory structure that maps 1:1 with URL structure
- Each page contains an `index.tsx` responsible for its view and logic
- Dynamic routing is represented in the `[parameter]` format

#### 3. Component Structure

Each component groups related files in a single directory to increase cohesion:

```
ComponentName/
├── shared/         # Internal shared elements
├── index.tsx      # Component implementation
├── types.ts       # Type definitions
├── utils.ts       # Utility functions
└── const.ts       # Constant definitions
```

## Rules

### Import Rules

#### voyl/same-hierarchy-import

This rule allows importing only from files in the same hierarchy.

```typescript
// Imports within the same hierarchy
import { ProductList } from './ProductList' // ✅ Component in the same hierarchy
import { types } from './types' // ✅ File in the same directory

import { Something } from '../other/Something' // ❌ Different hierarchy
import { Deep } from './deep/nested/Component' // ❌ Deeply nested path

// Shared imports
import { SharedButton } from '@/pages/shared/Button' // ✅ Shared file/folder from higher hierarchy
import { ListItem } from './shared/ListItem' // ✅ Shared file/folder from same hierarchy

import { Sub } from './shared/Button/Sub' // ❌ Path below shared
import { Other } from '../shared/Other' // ❌ Shared from different hierarchy (except higher)
import { Button } from './products/shared/Button' // ❌ Shared from lower hierarchy
```

#### voyl/model-store-import-only

This rule allows importing only stores from the models layer.

```typescript
import useTreeViewStore from '@/models/treeView/store' // ✅ Store from a model

import { useTreeStore } from '@/models/treeView/draggingNode' // ❌ Deeply nested path in model
```

## Related Documentation

For detailed information about other layers, please refer to the following documents:

- [Project Structure](../README.md)
- [Models Structure](../models/README.md)
- [Common Structure](../common/README.md)
