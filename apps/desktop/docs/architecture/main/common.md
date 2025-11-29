# main/common 구조

## 개요

Common 모듈은 프로젝트 전반에서 재사용되는 도메인 독립적인 순수 공통 코드를 관리합니다.
높은 재사용성과 독립성을 위해 외부 의존성을 최소화합니다.

## 구조

### 기본 구조

```
common/
├── [utility].util.ts      # 유틸리티 함수
├── [constant].const.ts # 상수 정의
└── [type].type.ts    # 타입 정의
```

### 구성요소

- 유틸리티 함수, 상수, 타입 정의, 공통 인터페이스 등이 포함
- 특정 도메인에 종속되지 않는 순수한 공통 코드
- 외부 라이브러리만 의존하며 내부 모듈과 독립적으로 동작

## 규칙

### Import 규칙

#### voyl/same-hierarchy-import

- 동일 계층 내의 파일만 import할 수 있습니다.

  ```typescript
  // common/helper.ts
  import { ProductList } from './ProductList' // ✅ 동일 계층 파일
  import { types } from './types' // ✅ 같은 디렉토리 내 파일

  import { Something } from '../other/Something' // ❌ 다른 계층
  import { Deep } from './deep/nested/Component' // ❌ 깊은 중첩 경로
  ```

#### voyl/restrict-imports-to-pattern

- 다른 모듈의 코드를 import할 수 없습니다.

  ```typescript
  import { v4 as uuidv4 } from 'uuid' // ✅ 외부 라이브러리

  import { getNodeById } from '../models/node/index.js' // ❌ 다른 모듈
  import { db } from '../db/connect.js' // ❌ 다른 모듈
  ```

## 관련 문서

- [메인 프로세스 구조](../README.md)
- [Models 구조](../models/README.md)
- [데이터베이스 구조](../db/README.md)
