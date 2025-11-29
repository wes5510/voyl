# renderer/store 구조

## 개요

models는 도메인 기능을 구현하는 곳입니다.
각 model는 독립적인 도메인 단위로 구성되어 있습니다.

## 구조

### 기본 구조

```
models/
└── [model]/
    └── index.ts     # 외부로 노출되는 인터페이스
```

### 구성요소

- 도메인 모델의 데이터 구조와 비즈니스 로직이 위치
- 도메인 로직은 순수 함수로 구현

## 규칙

### Import 규칙

#### voyl/restrict-imports-to-pattern

- 다른 model과의 의존성을 금지합니다.
- pages 모듈의 코드를 import할 수 없습니다.

```typescript
// @/renderer/models/tree/index.ts
import useTreeStore from '@/renderer/models/tree/nodeTable' // ✅ 같은 model 파일

import usePathStore from '@/renderer/models/treeView' // ❌ 다른 model 파일
```

#### voyl/same-hierarchy-import

- 동일 계층 내의 파일만 import할 수 있습니다.

  ```typescript
  // 동일 계층 내 import
  import { ProductList } from './ProductList' // ✅ 동일 계층 컴포넌트
  import { types } from './types' // ✅ 같은 디렉토리 내 파일

  import { Something } from '../other/Something' // ❌ 다른 계층
  import { Deep } from './deep/nested/Component' // ❌ 깊은 중첩 경로
  ```

## 관련 문서

아래 문서에서 다른 모듈에 대한 상세 정보를 확인할 수 있습니다:

- [프로젝트 구조](../README.ko.md)
- [Pages 구조](../pages/README.ko.md)
- [Common 구조](../common/README.ko.md)
