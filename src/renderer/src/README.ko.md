# 프로젝트 구조

_다른 언어로 읽기: [English](./README.md)_

## 개요

프로젝트는 pages, features, shared로 구성되어 있습니다.
각 디렉토리는 명확한 책임과 규칙을 가지고 있어 코드의 응집도를 높이고 결합도를 낮춥니다.

## 구조

### 기본 구조

```
src/renderer/src/
├── pages/          # 페이지 컴포넌트
├── features/       # 도메인별 기능
│   └── [feature]/
│       ├── model/  # 도메인 로직
│       └── ui/     # UI 컴포넌트
└── shared/         # 공통 코드
```

### 구성요소

#### pages

- 페이지 단위의 컴포넌트들
- features를 조합하여 페이지를 구성
- features와 shared를 import하여 사용 가능

#### features

- 도메인 기능을 구현
- 각 feature는 독립적인 도메인 단위
- 다른 feature와의 의존성을 가질 수 없음
- shared를 import하여 사용 가능

#### shared

- 재사용 가능한 공통 코드
- UI 컴포넌트, 유틸리티 함수 등
- 다른 폴더의 코드를 import할 수 없음

## 규칙

### Import 규칙

#### 기본 규칙

`src/renderer/src` 아래의 모든 파일은 동일 위계의 import만 허용됩니다.

```typescript
// ✅ 좋은 예시
// 같은 디렉토리 내 import
import { Button } from './Button'
import { Icon } from './Icon'

// 직계 자식 디렉토리의 파일 import
import { SubComponent } from './SubComponent/index'

// ❌ 나쁜 예시
// 다른 위계의 import
import { Something } from '../other/Something'
import { DeepComponent } from './Deep/More/Component'
```

#### Interface 규칙

외부에서 접근 가능한 경로는 다음과 같습니다:

- `/features/*/model/index.ts`: feature의 model을 외부로 노출하는 단일 진입점
- `/features/*/ui/*`: feature의 ui 폴더 직계 파일들
- `/shared/*`: shared 폴더의 직계 폴더들

#### 예외 규칙

1. `/pages`는 아래 경로를 import 할 수 있습니다:

   - `/features/*/ui/*`
   - `/shared/*`

2. `/features/*/ui`는 아래 경로를 import 할 수 있습니다:
   - 자신의 `/features/*/model/index.ts`
   - `/shared/*`

## 관련 문서

- [Features 구조](./features/README.ko.md)
- [Pages 구조](./pages/README.ko.md)
