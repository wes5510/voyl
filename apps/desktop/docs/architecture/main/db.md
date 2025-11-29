# main/db 모듈 구조

## 개요

데이터베이스 모듈은 데이터베이스 관련 작업(스키마 정의, 쿼리, 연결 등)을 관리합니다.
각 테이블별로 독립적인 모듈로 구성되어 있습니다.

## 구조

### 기본 구조

```
db/
├── connect.ts      # 데이터베이스 연결 설정
└── [table]/        # 테이블 관리
│   ├── index.ts    # 쿼리 함수
│   └── schema.ts   # 스키마 정의
```

### 구성요소

#### connect.ts

- 데이터베이스 연결 설정 및 초기화
- common를 import하여 사용 가능

#### 각 테이블 모듈 ([table]/)

- 테이블별 스키마 정의와 쿼리 함수를 관리
- `schema.ts`: 테이블 스키마 정의 및 타입 정의
- `index.ts`: 해당 테이블의 CRUD 쿼리 함수
- common와 동일 테이블 내 파일만 import하여 사용 가능

## 규칙

### Import 규칙

#### voyl/same-hierarchy-import

- 동일 계층 내의 파일만 import할 수 있습니다.

  ```typescript
  // node/index.ts
  import { ProductList } from './ProductList' // ✅ 동일 계층 파일
  import { types } from './types' // ✅ 같은 디렉토리 내 파일

  import { Something } from '../other/Something' // ❌ 다른 계층
  import { Deep } from './deep/nested/Something' // ❌ 깊은 중첩 경로
  ```

#### voyl/restrict-imports-to-pattern

- common만 import 가능

  ```typescript
  import { db } from '../connect.js' // ✅ connect 파일
  import { someUtil } from '../../common/helper.js' // ✅ common 모듈

  import { someModel } from '../../models/node/index.js' // ❌ models 모듈
  ```

## 관련 문서

- [메인 프로세스 구조](../README.md)
- [Models 구조](../models/README.md)
- [Common 구조](../common/README.md)
