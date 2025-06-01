# 메인 프로세스 구조

## 개요

메인 프로세스(`/src/main/`)는 Electron 애플리케이션의 백엔드 역할을 수행하며, 데이터베이스 관리, 비즈니스 로직 처리, IPC 통신을 담당합니다.
각 모듈은 명확한 책임과 의존성 규칙을 가지고 있어 코드의 응집도를 높이고 결합도를 낮춥니다.

## 구조

### 기본 구조

```
src/main/
├── index.ts        # 애플리케이션 진입점
├── db/             # 데이터베이스 모듈
├── models/         # 도메인 모델 & 비즈니스 로직
├── ipc/            # IPC 통신 관리
├── windows/        # 창 관리
└── common/          # 공통 코드
```

### 구성요소

#### index.ts

- 애플리케이션의 진입점으로, Electron 앱을 초기화하고 메인 창을 생성
- windows와 ipc를 import하여 사용 가능

#### db

- 데이터베이스 관련 작업(스키마 정의, 쿼리, 연결 등)을 관리
- common를 import하여 사용 가능

#### models

- 도메인 모델의 데이터 구조와 비즈니스 로직이 위치
- db와 common를 import하여 사용 가능

#### ipc

- 메인 프로세스와 렌더러 프로세스 간의 IPC 통신을 관리
- models와 common를 import하여 사용 가능

#### windows

- 애플리케이션 창의 생성과 관리를 담당
- common를 사용하며, 필요 시 models도 import하여 사용 가능

#### common

- 재사용 가능한 순수한 공통 코드
- 특정 도메인에 종속되지 않음
- 다른 모듈의 코드를 import할 수 없음

## 규칙

각 모듈은 특정 규칙과 제약 사항을 따라야 합니다. 자세한 내용은 각 모듈별 문서를 참고하세요.

## 관련 문서

아래 문서에서 각 모듈에 대한 상세 정보를 확인할 수 있습니다:

- [Renderer 구조](../renderer/src/README.md)
- [DB 모듈](./db/README.md)
- [IPC 모듈](./ipc/README.md)
- [Common 모듈](./common/README.md)
- [Models 모듈](./modesl/README.md)
- [Windows 모듈](./windows/README.md)
