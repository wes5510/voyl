# main/windows 구조

## 개요

Windows는 애플리케이션 창의 생성과 관리를 담당하는 곳입니다.
각 윈도우 관리 기능은 독립적인 단위로 구성되어 있습니다.

## 구조

### 기본 구조

```
windows/
└── windowManager.ts    # 창 관리 기능별 파일
```

### 구성요소

- 창 생성, 크기 조정, 닫기 등의 윈도우 관리 기능
- 멀티 윈도우 지원을 위한 윈도우 상태 관리
- Electron BrowserWindow API를 추상화하여 제공

## 규칙

### Import 규칙

#### voyl/restrict-imports-to-pattern

- common와 models만 import 가능

  ```typescript
  // windows/windowManager.ts
  import { someUtil } from '../common/helper.js' // ✅ common 모듈
  import { getWindowState } from '../models/window/index.js' // ✅ models 모듈 (필요시)

  import { db } from '../db/connect.js' // ❌ db 모듈 직접 접근
  import { ipcHandler } from '../ipc/nodes.js' // ❌ 다른 모듈
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
