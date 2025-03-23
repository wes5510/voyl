# Project Structure

_Read this in other languages: [한국어](./README.ko.md)_

## Overview

The project consists of three core layers: pages, models, and common.
Each layer has clear responsibilities and rules to increase cohesion and decrease coupling.

## Structure

### Basic Structure

```
src/renderer/src/
├── pages/          # Page components
├── models/         # Domain model data structures & business logic
└── common/         # Common code
```

### Components

#### pages

- Components for each page
- Compose pages using models
- Can import from models and common

#### models

- Contains domain model data structures and business logic
- Each model is an independent domain unit
- Cannot have dependencies on other models
- Can import from common

#### common

- Pure shared code that can be reused
- Not dependent on specific domains
- Cannot import from other layers

## Rules

Each layer follows specific rules and constraints. Please refer to each layer's README for details.

## Related Documentation

For detailed information, please refer to the following documents:

- [Models Structure](./models/README.md)
- [Pages Structure](./pages/README.md)
- [Common Structure](./common/README.md)
