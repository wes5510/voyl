# main/common 구조

## 개요

Common 모듈은 프로젝트 전반에서 재사용되는 도메인 독립적인 순수 공통 코드를 관리합니다.
높은 재사용성과 독립성을 위해 외부 의존성을 최소화합니다.

## 구조

```
common/
├── logger.util.ts      # 유틸리티 함수
├── app.const.ts        # 상수 정의
└── node.type.ts        # 타입 정의
```

### 구성요소

- 유틸리티 함수, 상수, 타입 정의, 공통 인터페이스 등이 포함
- 특정 도메인에 종속되지 않는 순수한 공통 코드
- 외부 라이브러리만 의존하며 내부 모듈과 독립적으로 동작

## 규칙

### Import 규칙

#### voyl/same-hierarchy-import

- 동일 계층 내의 파일만 import할 수 있습니다.

#### voyl/restrict-imports-to-pattern

- 다른 모듈의 코드를 import할 수 없습니다.
- 외부 라이브러리는 허용됩니다.

