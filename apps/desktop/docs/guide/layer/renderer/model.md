# renderer/model 구조

## 개요

model은 도메인 기능을 구현하는 곳입니다.
각 model은 독립적인 도메인 단위로 구성되어 있습니다.

## 구조

```
model/
├── tree/
│   └── index.ts
├── treeView/
│   └── index.ts
├── path/
│   └── index.ts
└── favoriteManager/
    └── index.ts
```

### 구성요소

- 도메인 모델의 데이터 구조와 비즈니스 로직이 위치
- 도메인 로직은 순수 함수로 구현

## Import 규칙

- common만 import 가능
