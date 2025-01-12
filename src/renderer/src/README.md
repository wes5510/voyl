# Project Structure

_Read this in other languages: [한국어](./README.ko.md)_

## Overview

The project consists of three core directories: pages, features, and common.
Each directory has clear responsibilities and rules to increase cohesion and decrease coupling.

## Structure

### Basic Structure

```
src/renderer/src/
├── pages/          # Page components
├── features/       # Domain features
│   └── [feature]/
│       ├── model/  # Domain logic
│       └── ui/     # UI components
└── common/         # Common code
```

### Components

#### pages

- Components for each page
- Compose pages using features
- Can import from features and common

#### features

- Implements domain functionality
- Each feature is an independent domain unit
- Cannot have dependencies on other features
- Can import from common

#### common

- Pure shared code that can be reused
- Not dependent on specific domains
- Cannot import from other directories

## Rules

### Import Rules

#### Directory Imports

```
pages/ → features/*/model     # Single entry point of each feature model
pages/ → features/*/ui/*      # Direct files in each feature's ui
pages/ → common/*            # Direct files in common

features/*/ui/* → features/*/model  # Single entry point of own feature model
features/ → common/*               # Direct files in common

common/ → No external dependencies
```

## ESLint Rules

```javascript
{
  "rules": {
    "voyl/import-path-format": "error",    // Only allow permitted import paths
  }
}
```

## Related Documentation

For detailed information, please refer to each directory's README:

- [Features Structure](./features/README.md)
- [Pages Structure](./pages/README.md)
- [Common Structure](./common/README.md)
