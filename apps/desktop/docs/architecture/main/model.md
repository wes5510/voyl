# main/model 구조

## 개요

models는 도메인 모델과 비즈니스 로직을 구현하는 곳입니다.
각 model은 독립적인 도메인 단위로 구성되어 있습니다.

## 구조

### 기본 구조

```
models/
└── [model]/
    ├── index.ts
    └── [sub model]/     # 하위 도메인 (선택적)
        └── index.ts
```

### 구성요소

- 도메인 모델의 데이터 구조와 비즈니스 로직이 위치
- db 레이어를 추상화하여 복잡한 비즈니스 규칙 구현
- 순수 함수와 명확한 인터페이스로 구성

## 규칙

### Import 규칙

#### voyl/restrict-imports-to-pattern

- db와 common만 import 가능

  ```typescript
  // models/node/index.ts
  import * as db from '../../db/node/index.js' // ✅ db 모듈
  import { someUtil } from '../../common/helper.js' // ✅ common 모듈

  import { ipcMain } from '../../ipc/index.js' // ❌ 다른 모듈
  ```

- 다른 model과의 의존성을 금지합니다.

  ```typescript
  // models/node/index.ts
  import { getNodeById } from './helper' // ✅ 같은 model 파일

  import { getUserById } from '../user/index' // ❌ 다른 model 파일
  ```

#### voyl/same-hierarchy-import

- 동일 계층 내의 파일만 import할 수 있습니다.

  ```typescript
  import { ProductList } from './ProductList' // ✅ 동일 계층 파일
  import { types } from './types' // ✅ 같은 디렉토리 내 파일

  import { Something } from '../other/Something' // ❌ 다른 계층
  import { Deep } from './deep/nested/Component' // ❌ 깊은 중첩 경로
  ```

## 관련 문서

- [메인 프로세스 구조](../README.md)
- [데이터베이스 구조](../db/README.md)
- [Common 구조](../common/README.md) (예정)
