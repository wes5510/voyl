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

## Rules

### Import Rules

#### Allowed Imports

```typescript
// 1. Same Directory Imports
import { Button } from './Button' // ✅ Files/folders in the same directory
import { useTable } from './useTable' // ✅ Files in the same directory

// 2. Subdirectory index.ts/tsx Imports
import { ChevronRight } from './icons' // ✅ index.ts/tsx from subdirectory
```

#### Forbidden Imports

```typescript
// 1. Direct Subdirectory Imports
import { ChevronRight } from './icons/ChevronRight' // ❌ Direct subdirectory access

// 2. Deep Nested Folder Imports
import { Something } from './deep/nested/index' // ❌ Deep nested folders

// 3. External Directory Imports
import { Something } from '../features/Something' // ❌ External directories
```

## ESLint Rules

```javascript
{
  "rules": {
    "voyl/import-path-format": "error",    // Only allow permitted import paths
  }
}
```
