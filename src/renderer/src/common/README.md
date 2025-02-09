# Common Structure

_Read this in other languages: [한국어](README.ko.md)_

## Overview

common manages pure shared code that is reused throughout the project.
It minimizes external dependencies to maintain high reusability and independence.

## Structure

### Basic Structure

```
common/
├── Button/         # UI Components
│   └── index.tsx
├── useTable.ts     # React hooks
├── date.util.ts    # Utility functions
├── date.const.ts   # Constants
└── table.type.ts   # Type definitions
```

### Components

- Includes UI components, React hooks, utility functions, constants, and type definitions
- Pure shared code that is not dependent on specific domains
- All files are located at the root level (Flatten structure)
- Components can be structured as either single files (.tsx) or folders (index.tsx)

## Import Rules

### voyl/same-hierarchy-import

```typescript
// Same hierarchy imports
import { ProductList } from './ProductList' // ✅ Files/folders in same directory
import { types } from './types' // ✅ Files in same directory

import { Something } from '../other/Something' // ❌ Different hierarchy
import { Deep } from './deep/nested/Component' // ❌ Deep nested path

// Shared imports
import { SharedButton } from '@/common/shared/Button' // ✅ Upper hierarchy shared
import { ListItem } from './shared/ListItem' // ✅ Same hierarchy shared

import { Sub } from './shared/Button/Sub' // ❌ Shared subdirectory
import { Other } from '../shared/Other' // ❌ Different hierarchy shared (except upper)
import { Button } from './products/shared/Button' // ❌ Lower hierarchy shared
```

### voyl/common-isolation

```typescript
// Allowed imports
import * as React from 'react' // ✅ node_modules modules

// Forbidden imports
import { TreeView } from '@/features/tree/ui/TreeView' // ❌ Other layer modules
import { PageComponent } from '@/pages/some-page' // ❌ Pages layer modules
```
