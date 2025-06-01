# IPC 구조

## 개요

IPC는 메인 프로세스와 렌더러 프로세스 간의 통신을 관리하는 곳입니다.
각 핸들러는 독립적인 기능 단위로 구성되어 있습니다.

## 구조

### 기본 구조

```
ipc/
├── index.ts        # 모든 IPC 핸들러 등록
└── [handler].ts    # 도메인별 IPC 핸들러
```

### 구성요소

- 렌더러 프로세스 요청을 적절한 models 함수로 라우팅
- IPC 통신의 타입 안전성과 에러 처리를 담당
- 도메인별로 핸들러를 분리하여 관리

## 규칙

### Import 규칙

#### voyl/restrict-imports-to-pattern

- models와 common만 import 가능

  ```typescript
  // ipc/nodes.ts
  import { getNodeTitleById } from '../models/node/index.js' // ✅ models 모듈
  import { someUtil } from '../common/helper.js' // ✅ common 모듈

  import { db } from '../db/connect.js' // ❌ db 모듈 직접 접근
  ```

- 다른 IPC 핸들러와의 의존성을 금지합니다.

  ```typescript
  // ipc/nodes.ts
  import { IpcMain } from 'electron' // ✅ 외부 라이브러리

  import { someHandler } from './users.js' // ❌ 다른 IPC 핸들러
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
- [Models 구조](../models/README.md)
- [Common 구조](../common/README.md) (예정)
