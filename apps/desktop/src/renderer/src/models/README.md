# Models Structure

_Read this in other languages: [한국어](README.ko.md)_

## Overview

Models layer is where domain functionality is implemented.
Each model is structured as an independent domain unit.

## Structure

### Basic Structure

```
models/
└── [model]/
    ├── index.ts    # Model's basic interface
    └── store.ts    # State management interface exposed externally
```

### Components

- Contains domain model data structures and business logic
- `store.ts` manages state and exposes actions
- Domain logic is implemented as pure functions

## Rules

### Import Rules

#### voyl/no-cross-model-imports

This rule prohibits dependencies on other models.

```typescript
// @/models/tree/index.ts
import useTreeStore from '@/models/tree/nodeTable' // ✅ Same model file

import usePathStore from '@/models/treeView' // ❌ Different model file
```

#### voyl/no-pages-import

This rule prohibits importing code from the pages layer.

```typescript
import { TreeView } from '@/pages/tree/ui' // ❌ Pages layer file
```

#### voyl/same-hierarchy-import

This rule allows importing only from files in the same hierarchy.

```typescript
// Imports within the same hierarchy
import { ProductList } from './ProductList' // ✅ Component in the same hierarchy
import { types } from './types' // ✅ File in the same directory

import { Something } from '../other/Something' // ❌ Different hierarchy
import { Deep } from './deep/nested/Component' // ❌ Deeply nested path
```

## Related Documentation

For detailed information about other layers, please refer to the following documents:

- [Project Structure](../README.md)
- [Pages Structure](../pages/README.md)
- [Common Structure](../common/README.md)
