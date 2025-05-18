# 프로젝트 구조

_다른 언어로 읽기: [English](./README.md)_

## 개요

프로젝트는 pages, models, common 세 개의 핵심 레이어로 구성되어 있습니다.
각 레이어는 명확한 책임과 규칙을 가지고 있어 코드의 응집도를 높이고 결합도를 낮춥니다.

## 구조

### 기본 구조

```
src/renderer/src/
├── pages/          # 페이지 컴포넌트
├── models/         # 도메인 모델의 데이터 구조 & 비즈니스 로직
└── common/         # 공통 코드
```

### 구성요소

#### pages

- 페이지 단위의 컴포넌트들
- models를 조합하여 페이지를 구성
- models와 common을 import하여 사용 가능

#### models

- 도메인 모델의 데이터 구조와 비즈니스 로직이 위치
- 각 model는 독립적인 도메인 단위
- 다른 model와의 의존성을 가질 수 없음
- common을 import하여 사용 가능

#### common

- 재사용 가능한 순수한 공통 코드
- 특정 도메인에 종속되지 않음
- 다른 레이어의 코드를 import할 수 없음

## 규칙

각 레이어는 특정 규칙과 제약 사항을 따라야 합니다. 자세한 내용은 각 레이어별 README를 참고하세요.

## 관련 문서

아래 문서에서 각 레이어에 대한 상세 정보를 확인할 수 있습니다:

- [Models 구조](./models/README.ko.md)
- [Pages 구조](./pages/README.ko.md)
- [Common 구조](./common/README.ko.md)
