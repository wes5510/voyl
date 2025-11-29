# Voyl Desktop

## 개요

Voyl은 누구나 자유롭게 일할 수 있는 유연한 도구로, 개인의 생산성을 극대화하는 것을 목표로 합니다.

기존 생산성 도구의 복잡성과 접근성 문제를 해결하기 위해 개발되었습니다. 로그인 없이 즉시 사용 가능하며, 오프라인에서도 동작하는 점이 핵심 특징입니다.

## 주요 기능

| 기능           | 설명                                                             |
| -------------- | ---------------------------------------------------------------- |
| Node 관리      | Node 생성, 삭제, 수정, 이동. Node는 태스크, 폴더, 노트 등을 포함 |
| 속성 관리      | 사용자 정의 속성 추가 (예: 마감일, 태그)                         |
| 트리 뷰        | 계층적 트리 구조로 Node 표시                                     |
| 태스크 관리    | 마감일 설정 및 완료 체크                                         |
| 검색           | 키워드 기반 Node 검색                                            |
| 오프라인 사용  | 인터넷 없이 로컬 저장소로 사용 가능                              |
| 계정 없이 사용 | 계정 생성 없이 즉시 사용 가능                                    |

## 기술 스택

### 핵심 기술

- **Electron** - 데스크톱 애플리케이션 프레임워크
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** + **electron-vite** - 빌드 도구

### 데이터

- **better-sqlite3** - SQLite 데이터베이스
- **drizzle-orm** - TypeScript ORM
- **로컬 파일 시스템** - Source of Truth (JSON, Markdown)

### 상태 관리

- **Zustand** - 로컬 상태 관리
- **React Query** - 서버 상태 관리

### UI

- **Tailwind CSS** - 스타일링
- **Shadcn UI** - UI 컴포넌트
- **Lucide React** - 아이콘

## 데이터 저장 구조

```
[워크스페이스]/
├── nodes/
│   └── 74da8d.json         # 노드 메타데이터
├── content/
│   └── 74da8d.md           # 긴 본문 내용
├── log/
│   └── 2025-07-20.log      # 변경 이력
└── settings.json           # 워크스페이스 설정
```

- 로컬 파일 시스템을 **Source of Truth**로 사용
- SQLite는 검색/정렬 성능 개선용 캐시

## 문서 구조

- `architecture/` - 아키텍처 문서
- `guide/` - 개발, 설계 등 관련 가이드
- `spec/` - 기술 명세 (일회성)
- `planning/` - 계획 및 할 일
- `whiteboard/` - 논의 및 맥락

## 문서 컨벤션

### 폴더명
- 단수형 네임스페이스 (architecture, guide, spec, planning, whiteboard)

### 파일명
- 소문자 케밥 스타일 (`kebab-case.md`)
- 폴더 대표 문서는 폴더명과 동일 (`spec/spec.md`, `guide/guide.md`)

## 참고 자료

- [Figma 디자인](https://www.figma.com/design/0vsrLsYI2ufbFsx6iroDyo/voyl?node-id=2-24&p=f&t=MMurVeifAPcxkDr7-0)
