# ESLint Rules Requirements

## Common Requirements

- 상대 경로와 절대 경로(@/) 모두 지원
- ignorePatterns 옵션으로 특정 경로 무시 가능 (예: `/styled-system/**`)

## 1. same-hierarchy-import

### 기본 처리

- node_modules import는 허용
- ignorePatterns에 포함된 경로는 허용

### shared 디렉토리 규칙

- 같은 위계나 상위 위계의 shared 접근 허용
  - 허용: `import { Button } from './shared/Button'`
  - 허용: `import { Button } from '../shared/Button'`
  - 허용: `import { Button } from '../../shared/Button'`
  - 허용: `import { Button } from '../../../shared/Button'`
- shared 내부는 한 단계 깊이만 허용
  - 허용: `import { Button } from './shared/Button'`
  - 금지: `import { Button } from './shared/deep/Button'`

### 일반 import 규칙

- 같은 디렉토리 내 import만 허용
  - 허용: `import { Something } from './Something'`
  - 금지: `import { Something } from './deep/Something'`
- index 파일은 상위 디렉토리 기준으로 판단
  - 허용: `pages/a.ts`에서 `pages/Something/index.ts` import
  - 허용: `pages/deep/a.ts`에서 `pages/deep/Something/index.ts` import

## 2. pages-feature-access

### pages에서 features로의 접근 규칙

- features의 model과 ui 디렉토리 직접 접근만 허용
  - 허용: `import { useStore } from '@/features/something/model'`
  - 허용: `import { Component } from '@/features/something/ui'`
  - 금지: `import { util } from '@/features/something/ui/deep/util'`

## 3. feature-model-access

### feature의 model 접근 규칙

- 같은 feature 내에서만 model 접근 허용
  - 허용: `features/something/ui`에서 `features/something/model` 접근
  - 금지: `features/other/ui`에서 `features/something/model` 접근

## 4. feature-isolation

### feature 간 격리 규칙

- 다른 feature로의 접근 금지
  - 허용: 같은 feature 내 import
  - 금지: 다른 feature로의 import

## 5. common-isolation

### common 디렉토리 격리 규칙

- features나 pages로의 접근 금지
  - 허용: common 내부 import
  - 금지: features나 pages로의 import
