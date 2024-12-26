# Pages Directory Structure

_Read this in other languages: [한국어](README.ko.md)_

This document explains the structure and rules of the `pages/` directory.

## Directory Structure Example

```
pages/
├── shared/                 # Elements available at all hierarchy levels
│   ├── Button/
│   │   ├── index.tsx       # Button component
│   │   ├── types.ts        # Type definitions
│   │   ├── utils.ts        # Utility functions
│   │   └── const.ts        # Constants
│   ├── Input/
│   │   ├── index.tsx
│   │   └── types.ts
│   └── Header/
│       ├── index.tsx
│       └── const.ts
├── products/               # Product related pages
│   ├── ProductList/        # Product list component
│   │   ├── index.tsx
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── ProductDetail/      # Product detail component
│   │   ├── index.tsx
│   │   └── const.ts
│   ├── [id]/               # Dynamic routing
│   │   ├── Detail/         # ID specific page component
│   │   │   └── index.tsx
│   │   └── index.tsx       # /products/:id page
│   └── index.tsx           # /products page
└── index.tsx               # Root page
```

## Core Rules

### 1. Hierarchical Structure
- Components are organized in a hierarchical folder structure
- Related files (components, types, utilities, etc.) are located in the same folder
- All folders use `index.tsx` as their entry point

### 2. Import Restrictions
- Imports are only allowed between files at the same hierarchy level
- Direct children of `shared/` are an exception, allowing imports from same and lower hierarchy levels

#### Import Examples
```typescript
// File: pages/products/ProductList/index.tsx
// 1. Same hierarchy level imports
import SubList from './SubList'                         // ✅ component in same directory
import { ProductListType } from './types'               // ✅ types in same directory
import { formatProduct } from './utils'                 // ✅ utilities in same directory
import { PRODUCT_STATUS } from './const'                // ✅ constants in same directory

// 2. shared imports (exception allowing imports from same and lower hierarchy levels)
import { Button } from '@/pages/shared/Button.tsx'      // ✅ direct child of shared can be imported
```

#### Prohibited Imports
```typescript
// File: pages/products/ProductList/index.tsx
// 1. Cross-hierarchy component references
import { OrderList } from '@/pages/orders/OrderList'          // ❌ component from different hierarchy
import { ProductDetail } from '../ProductDetail'              // ❌ component from upper hierarchy

// 2. shared directory references
// File: pages/products/ProductList/index.tsx
import { SubButton } from '@/pages/shared/Button/SubButton'   // ❌ cannot import from shared subdirectories
import { SubButton } from './SubButton/shared/Button'         // ❌ cannot import from shared in lower hierarchy
```

## ESLint Rules

The project includes ESLint rules to enforce this structure:

```javascript
{
  "rules": {
    "voyl/import-path-format": "error",    // Check import path rules
    "voyl/component-structure": "error"    // Check component structure rules
  }
}
```
