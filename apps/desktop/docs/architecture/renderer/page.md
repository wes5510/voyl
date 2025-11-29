# renderer/page 구조

## 개요

page 레이어는 애플리케이션의 UI 컴포넌트와 사용자 인터페이스를 구성합니다.

## 구조

```
page/
├── nodes/               # /nodes 페이지 (소문자 = URL)
│   └── MainPanel/       # 컴포넌트 (대문자)
├── SideBar/             # 컴포넌트
├── TopBar/              # 컴포넌트
│   └── Path/
│       └── shared/      # 공유 컴포넌트
└── index.tsx            # 루트 페이지
```

### 구성요소

#### 1. 페이지 디렉토리 (소문자)

- URL 구조와 1:1로 매칭되는 디렉토리 구조
- 각 페이지는 `index.tsx` 포함
- 동적 라우팅은 `[parameter]` 형식으로 표현

#### 2. 컴포넌트 (대문자)

- 관련 파일들을 하나의 디렉토리에 모아 응집도를 높임
- `index.tsx`, `types.ts`, `utils.ts`, `const.ts` 등 포함 가능

#### 3. shared/

- 공유되는 컴포넌트, 타입, 유틸리티 함수, 상수들이 위치
- 동일 및 상위 계층에서만 접근 가능

## Import 규칙

- state, common만 import 가능
