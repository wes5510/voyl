# 페이지 디렉토리 구조

_다른 언어로 읽기: [English](README.md)_

이 문서는 `pages/` 디렉토리의 구조와 규칙을 설명합니다.

## 디렉토리 구조 예시

```
pages/
├── shared/                          # 모든 레벨에서 사용 가능한 요소
│   └── components/                 # 공유 컴포넌트
│       ├── Button/
│       ├── Input/
│       ├── Header/
│       └── Sidebar/
├── components/                     # 페이지 레벨 전용 컴포넌트
│   └── BigComponent/             # 내부 구조를 가진 큰 컴포넌트
│       ├── shared/              # BigComponent 스코프 내 공유 요소
│       │   ├── const.ts       # 상수
│       │   ├── types.ts      # 타입
│       │   └── utils.ts     # 유틸리티
│       ├── SubComponentA/   # 하위 컴포넌트
│       └── SubComponentB/  # 하위 컴포넌트
├── products/                      # 상품 관련 페이지
│   ├── shared/                   # products/ 하위에서 공유되는 요소
│   │   └── components/
│   │       └── ProductCard/     # 상품 카드 컴포넌트
│   ├── components/              # products 페이지 전용 컴포넌트
│   │   ├── ProductList/        # 상품 목록 컴포넌트
│   │   ── ProductFilter/      # 상품 필터 컴포넌트
│   ├── [id]/                    # 특정 상품 페이지 (동적 라우팅)
│   │   ├── components/         # 특정 상품 전용 컴포넌트
│   │   │   ├── ProductDetail/  # 상품 상세 정보
│   │   │   └── ReviewList/    # 리뷰 목록
│   │   └── page.tsx           # /products/:id 페이지
│   └── page.tsx                # /products 페이지
└── page.tsx                     # 루트 페이지 (라우팅 포함)
```

## 핵심 개념

### 1. 의존성 방향

- `shared/`: 하위 레벨에서 자유롭게 사용 가능한 컴포넌트
- `components/`: 같은 레벨에서만 사용 가능한 컴포넌트
- 의존성은 항상 위에서 아래로 흐름 (하위 레벨은 상위 레벨을 참조할 수 없음)

### 2. 컴포넌트 위치

- 모든 컴포넌트는 `components/` 또는 `shared/components/` 하위에 위치
- 페이지 컴포넌트는 `page.tsx`로 명명
- 동적 라우팅은 `[paramName]` 형식의 폴더 사용

### 3. 모듈 특성

- `shared/components/`: 순수 UI 컴포넌트
- `components/`: 비즈니스 로직을 포함할 수 있는 컴포넌트
- `page.tsx`: 라우팅과 레이아웃에 집중

## Import 규칙

### 허용되는 Import

```typescript
// shared/ 컴포넌트
import { Button } from '@/pages/shared/components/common/Button' // ✅ 같은 레벨 shared
import { Icon } from '@/shared/components/Icon' // ✅ 상위 레벨 shared

// components/ 컴포넌트
import { ProductList } from '@/pages/products/components/ProductList' // ✅ 같은 레벨 components
import { Button } from '@/pages/shared/components/common/Button' // ✅ 상위 레벨 shared
import { CONST } from '../shared/const' // ✅ 컴포넌트 스코프 내 공유 요소

// page.tsx
import { ProductDetail } from './components/ProductDetail' // ✅ 현재 레벨 components
import { Button } from '@/pages/shared/components/common/Button' // ✅ 상위 레벨 shared
import ReviewPage from './reviews/page' // ✅ 하위 레벨 page
```

### 금지되는 Import

```typescript
// ❌ 하위 레벨 모듈 참조
import { ReviewList } from '@/pages/products/[id]/components/ReviewList'

// ❌ 다른 레벨의 components 참조
import { ProductList } from '@/pages/products/components/ProductList'

// ❌ 하위 레벨의 shared 참조
import { ProductCard } from '@/pages/products/shared/components/ProductCard'

// ❌ 다른 컴포넌트의 shared 요소 참조
import { CONST } from '@/pages/products/components/OtherComponent/shared/const'
```

### 컴포넌트 스코프 규칙

1. **컴포넌트 레벨 공유 요소**

   - 컴포넌트는 내부 사용을 위한 자체 `shared/` 디렉토리를 가질 수 있음
   - 이러한 공유 요소는 해당 컴포넌트의 스코프 내에서만 접근 가능
   - 내부 공유 요소는 상대 경로(`../shared/`)로 import해야 함

2. **스코프 경계**

   - 컴포넌트의 공유 요소는 다른 컴포넌트에서 import할 수 없음
   - 각 컴포넌트의 공유 요소는 독립적이고 캡슐화되어야 함

3. **디렉토리 구조**
   ```
   components/
   └── BigComponent/
       ├── shared/           # 공유 요소 (내부 사용 전용)
       │   ├── const.ts     # 상수
       │   ├── types.ts    # 타입
       │   └── utils.ts   # 유틸리티
       ├── SubComponentA/
       └── SubComponentB/
   ```

## ESLint 규칙

프로젝트는 이 구조를 강제하기 위한 ESLint 규칙을 포함합니다:

```javascript
{
  "rules": {
    "voyl/dependency-direction": "error",
    "voyl/import-path-format": "error",
    "voyl/component-location": "error",
    "voyl/module-type-control": "error",
    "voyl/no-circular-dependency": "error",
    "voyl/file-structure": "error"
  }
}
```

## 왜 이런 구조를 사용하나요?

1. **명확한 의존성**

   - 컴포넌트 간의 의존 관계가 명확
   - 순환 참조 방지
   - 코드 이해도 향상

2. **재사용성**

   - `shared/`를 통한 효율적인 컴포넌트 재사용
   - 각 레벨별 적절한 추상화 수준 유지

3. **유지보수성**

   - 관심사의 명확한 분리
   - 예측 가능한 코드 구조
   - 쉬운 코드 네비게이션

4. **확장성**
   - 새로운 기능 추가가 용이
   - 기존 구조를 해치지 않는 자연스러운 확장
