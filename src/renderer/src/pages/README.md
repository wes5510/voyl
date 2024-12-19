# Pages Directory Structure

_Read this in other languages: [한국어](README.ko.md)_

This document explains the structure and rules of the `pages/` directory.

## Directory Structure Example

```
pages/
├── shared/                          # Elements available at all levels
│   └── components/                 # Shared components
│       ├── Button/
│       ├── Input/
│       ├── Header/
│       └── Sidebar/
├── components/                     # Page level exclusive components
│   └── BigComponent/             # Large component with internal structure
│       ├── shared/              # Shared elements within BigComponent scope
│       │   ├── const.ts       # Constants
│       │   ├── types.ts      # Types
│       │   └── utils.ts     # Utilities
│       ├── SubComponentA/   # Sub-components
│       └── SubComponentB/  # Sub-components
├── products/                      # Product related pages
│   ├── shared/                   # Elements shared within products/
│   │   └── components/
│   │       └── ProductCard/     # Product card component
│   ├── components/              # Products page exclusive components
│   │   ├── ProductList/        # Product list component
│   │   └── ProductFilter/      # Product filter component
│   ├── [id]/                    # Specific product page (dynamic routing)
│   │   ├── components/         # Product specific components
│   │   │   ├── ProductDetail/  # Product detail information
│   │   │   └── ReviewList/    # Review list
│   │   └── page.tsx           # /products/:id page
│   └── page.tsx                # /products page
└── page.tsx                     # Root page (includes routing)
```

## Core Concepts

### 1. Dependency Direction

- `shared/`: Components that can be freely used by lower levels
- `components/`: Components that can only be used at the same level
- Dependencies always flow from top to bottom (lower levels cannot reference upper levels)

### 2. Component Location

- All components must be located under `components/` or `shared/components/`
- Page components must be named `page.tsx`
- Dynamic routing uses folders in the format `[paramName]`

### 3. Module Characteristics

- `shared/components/`: Pure UI components
- `components/`: Components that can include business logic
- `page.tsx`: Focus on routing and layout

## Import Rules

### Allowed Imports

```typescript
// shared/ components
import { Button } from '@/pages/shared/components/common/Button' // ✅ Same level shared
import { Icon } from '@/shared/components/Icon' // ✅ Upper level shared

// components/ components
import { ProductList } from '@/pages/products/components/ProductList' // ✅ Same level components
import { Button } from '@/pages/shared/components/common/Button' // ✅ Upper level shared
import { CONST } from '../shared/const' // ✅ Shared elements within component scope

// page.tsx
import { ProductDetail } from './components/ProductDetail' // ✅ Current level components
import { Button } from '@/pages/shared/components/common/Button' // ✅ Upper level shared
import ReviewPage from './reviews/page' // ✅ Lower level page
```

### Prohibited Imports

```typescript
// ❌ Lower level module reference
import { ReviewList } from '@/pages/products/[id]/components/ReviewList'

// ❌ Different level components reference
import { ProductList } from '@/pages/products/components/ProductList'

// ❌ Lower level shared reference
import { ProductCard } from '@/pages/products/shared/components/ProductCard'

// ❌ Other component's shared elements reference
import { CONST } from '@/pages/products/components/OtherComponent/shared/const'
```

### Component Scope Rules

1. **Component-level Shared Elements**

   - Components can have their own `shared/` directory for internal use
   - These shared elements are only accessible within the component's scope
   - Must use relative imports (`../shared/`) for internal shared elements

2. **Scope Boundaries**

   - Shared elements in a component's scope cannot be imported by other components
   - Each component's shared elements should be independent and encapsulated

3. **Directory Structure**
   ```
   components/
   └── BigComponent/
       ├── shared/           # Shared elements (internal use only)
       │   ├── const.ts     # Constants
       │   ├── types.ts    # Types
       │   └── utils.ts   # Utilities
       ├── SubComponentA/
       └── SubComponentB/
   ```

## ESLint Rules

The project includes ESLint rules to enforce this structure:

```javascript
{
  "rules": {
    "voyl/dependency-direction": "error",
    "voyl/import-path-format": "error",
    "voyl/component-location": "error",
    "voyl/module-type-control": "error",
    "voyl/no-circular-dependency": "error",
    "voyl/file-structure": "error"
  }
}
```

## Why This Structure?

1. **Clear Dependencies**

   - Clear component dependencies
   - Prevention of circular references
   - Improved code understanding

2. **Reusability**

   - Efficient component reuse through `shared/`
   - Maintaining appropriate abstraction levels for each level

3. **Maintainability**

   - Clear separation of concerns
   - Predictable code structure
   - Easy code navigation

4. **Scalability**
   - Easy addition of new features
   - Natural expansion without breaking existing structure
