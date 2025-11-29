# main/ipc 구조

## 개요

IPC 모듈은 메인 프로세스와 렌더러 프로세스 간의 통신을 관리합니다.
각 핸들러는 독립적인 기능 단위로 구성되어 있습니다.

## 구조

```
ipc/
├── index.ts        # 모든 IPC 핸들러 등록
└── [handler].ts    # 도메인별 IPC 핸들러
```

### 구성요소

- 렌더러 프로세스 요청을 적절한 model 함수로 라우팅
- IPC 통신의 타입 안전성과 에러 처리를 담당
- 도메인별로 핸들러를 분리하여 관리

## 규칙

### Import 규칙

#### voyl/same-hierarchy-import

- 동일 계층 내의 파일만 import할 수 있습니다.

#### voyl/restrict-imports-to-pattern

- model과 common만 import 가능합니다.
- 다른 IPC 핸들러와의 의존성을 금지합니다.
