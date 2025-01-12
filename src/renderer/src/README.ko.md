# 프로젝트 구조

_다른 언어로 읽기: [English](./README.md)_

## 개요

프로젝트는 pages, features, common 세 개의 핵심 디렉토리로 구성되어 있습니다.
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
└── common/         # 공통 코드
```

### 구성요소

#### pages

- 페이지 단위의 컴포넌트들
- features를 조합하여 페이지를 구성
- features와 common을 import하여 사용 가능

#### features

- 도메인 기능을 구현
- 각 feature는 독립적인 도메인 단위
- 다른 feature와의 의존성을 가질 수 없음
- common을 import하여 사용 가능

#### common

- 재사용 가능한 순수한 공통 코드
- 특정 도메인에 종속되지 않음
- 다른 폴더의 코드를 import할 수 없음

## 규칙

### Import 규칙

#### 디렉토리 간 Import

```
pages/ → features/*/model     # 각 feature model의 단일 진입점
pages/ → features/*/ui/*      # 각 feature의 ui 직계 파일
pages/ → common/*            # common의 직계 파일

features/*/ui/* → features/*/model  # 자신의 feature model의 단일 진입점
features/ → common/*               # common의 직계 파일

common/ → 외부 의존성 없음
```

## ESLint 규칙

```javascript
{
  "rules": {
    "voyl/import-path-format": "error",    // 허용된 import 경로만 사용
  }
}
```

## 관련 문서

자세한 내용은 각 디렉토리의 README를 참고하세요:

- [Features 구조](./features/README.ko.md)
- [Pages 구조](./pages/README.ko.md)
- [Common 구조](./common/README.ko.md)
