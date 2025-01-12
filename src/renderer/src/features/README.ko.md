# Features 구조

_다른 언어로 읽기: [English](README.md)_

## 개요

features는 도메인 기능을 구현하는 곳입니다.
각 feature는 독립적인 도메인 단위로 구성되어 있습니다.

## 구조

### 기본 구조

```
features/
└── [feature]/
    ├── model/           # 도메인 로직
    │   ├── index.ts     # 외부로 노출되는 인터페이스
    │   ├── store.ts     # 상태 관리
    │   └── types.ts     # 타입 정의
    └── ui/              # UI 컴포넌트
        ├── index.tsx    # 주요 컴포넌트
        └── Button/      # 내부 컴포넌트
```

### 구성요소

#### 1. model/

- 도메인 모델의 데이터 구조와 비즈니스 로직이 위치
- `index.ts`는 store를 통해 상태와 액션을 외부에 노출
- 도메인 로직은 순수 함수로 구현

#### 2. ui/

- 도메인 모델을 사용하여 구성된 UI 컴포넌트들이 위치
- 도메인 모델의 시각화와 사용자 인터랙션 처리
- UI 관련 로직 관리

## 규칙

### Import 규칙

#### 허용되는 Import

```typescript
// 1. 동일 디렉토리 내 Import
import { TreeView } from './TreeView' // ✅ 같은 디렉토리 내 폴더(index.ts/tsx)
import { types } from './types' // ✅ 같은 디렉토리 내 파일

// 2. shared 디렉토리 Import
import { SharedComponent } from '@/features/shared/Component' // ✅ 상위 위계 shared 파일/폴더
import { ListItem } from './shared/ListItem' // ✅ 동일 위계 shared 파일/폴더

// 3. 도메인 모델을 store를 통한 접근
import { useTreeStore } from '@/features/tree/model' // ✅ 자신의 feature model의 단일 진입점
```

#### 금지되는 Import

```typescript
// 1. 다른 위계 Import
import { Something } from '../other/Something' // ❌ 다른 위계
import { Deep } from './deep/nested/Component' // ❌ 깊은 중첩 경로

// 2. shared 제한
import { Sub } from './shared/Button/Sub' // ❌ shared 하위 경로
import { Other } from '../shared/Other' // ❌ 다른 위계 shared (상위 위계 제외)
import { Button } from './tree/shared/Button' // ❌ 하위 위계 shared

// 3. Feature 간 Import 금지
import { usePathStore } from '@/features/path/model' // ❌ 다른 feature의 model
import { PathView } from '@/features/path/ui' // ❌ 다른 feature의 ui
```

## ESLint 규칙

```javascript
{
  "rules": {
    "voyl/import-path-format": "error",    // 허용된 import 경로만 사용
  }
}
```
