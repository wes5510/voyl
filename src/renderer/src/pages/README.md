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

## Rules

### Import Rules

#### Allowed Imports

```typescript
// 1. Same Directory Imports
import SubList from './SubList' // ✅ Component in same directory
import { ProductListType } from './types' // ✅ Types in same directory

// 2. shared Directory Imports
import Button from '@/pages/shared/Button' // ✅ Higher hierarchy shared
import ListItem from './shared/ListItem' // ✅ Same hierarchy shared
```

#### Forbidden Imports

```typescript
// 1. Different Hierarchy Component Imports
import OrderList from '@/pages/orders/OrderList' // ❌ Different hierarchy
import ProductDetail from '../ProductDetail' // ❌ Higher hierarchy

// 2. shared Directory Import Restrictions
import SubButton from '@/pages/shared/Button/SubButton' // ❌ shared subdirectory
import ProductCard from '@/pages/orders/shared/ProductCard' // ❌ Different hierarchy shared
import Button from './products/shared/Button' // ❌ Lower hierarchy shared
```

## ESLint Rules

```javascript
{
  "rules": {
    "voyl/import-path-format": "error",    // Only allow permitted import paths
  }
}
```
