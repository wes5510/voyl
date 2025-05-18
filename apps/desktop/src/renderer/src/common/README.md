# Common Structure

_Read this in other languages: [한국어](README.ko.md)_

## Overview

The Common layer manages domain-independent pure shared code that can be reused across the project.
It minimizes external dependencies to ensure high reusability and independence.

## Structure

### Basic Structure

```
common/
├── Button/         # UI components
│   └── index.tsx
└── useTable.ts     # React hooks
```

### Components

- Includes UI components, React hooks, utility functions, constants, and type definitions
- Pure shared code that is not dependent on specific domains
- Components can be structured as single files (.tsx) or folders (index.tsx)

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
import { SharedButton } from '@/common/shared/Button' // ✅ Shared file/folder from higher hierarchy
import { ListItem } from './shared/ListItem' // ✅ Shared file/folder from same hierarchy

import { Sub } from './shared/Button/Sub' // ❌ Path below shared
import { Other } from '../shared/Other' // ❌ Shared from different hierarchy (except higher)
import { Button } from './products/shared/Button' // ❌ Shared from lower hierarchy
```

#### voyl/common-isolation

This rule prohibits importing code from other layers.

```typescript
import * as React from 'react' // ✅ Node modules

import type { TreeView } from '@/models/treeView' // ❌ Module from another layer
```

## Related Documentation

For detailed information about other layers, please refer to the following documents:

- [Project Structure](../README.md)
- [Models Structure](../models/README.md)
- [Pages Structure](../pages/README.md)
