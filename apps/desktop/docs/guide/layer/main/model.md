# main/model 구조

## 개요

Model 모듈은 도메인 모델과 비즈니스 로직을 구현합니다.
각 model은 독립적인 도메인 단위로 구성되어 있습니다.

## 구조

```
model/
└── [model]/
    ├── index.ts
    └── [sub model]/     # 하위 도메인 (선택적)
        └── index.ts
```

### 구성요소

- 도메인 모델의 데이터 구조와 비즈니스 로직이 위치
- repo 레이어를 추상화하여 복잡한 비즈니스 규칙 구현
- 순수 함수와 명확한 인터페이스로 구성

## Import 규칙

- repo, common만 import 가능
