# renderer 구조

## 개요

renderer는 page, model, state, repo, common 모듈로 구성되어 있습니다.
각 모듈은 명확한 책임과 규칙을 가지고 있어 코드의 응집도를 높이고 결합도를 낮춥니다.

## 구조

```
src/renderer/
├── page/           # 페이지 컴포넌트
├── model/          # 도메인 모델 & 비즈니스 로직
├── state/          # 상태 관리 (React Query + Zustand)
├── repo/           # 데이터 페칭 (IPC 통신)
└── common/         # 공통 코드
```

### 모듈

#### page

- 페이지 단위의 컴포넌트들
- model, state, common을 import하여 사용 가능

#### model

- 도메인 모델의 데이터 구조와 비즈니스 로직이 위치
- 각 model은 독립적인 도메인 단위
- common을 import하여 사용 가능

#### state

- 상태 관리 레이어 (React Query + Zustand)
- repo, common, model을 import하여 사용 가능

#### repo

- Main process와 IPC 통신
- 데이터 페칭 및 캐싱
- common을 import하여 사용 가능

#### common

- 재사용 가능한 순수한 공통 코드
- 특정 도메인에 종속되지 않음
- 다른 모듈의 코드를 import할 수 없음

## 규칙

각 모듈은 특정 규칙과 제약 사항을 따라야 합니다. 자세한 내용은 각 모듈별 문서를 참고하세요.
