# Design Doc 작성 가이드

## 개요

Design Doc은 **어떻게(How)** 구현할지 설계하는 문서입니다.

### Tech Spec과의 관계
- Tech Spec: 무엇을 하는지 (What)
- Design Doc: 어떻게 하는지 (How)
- Tech Spec 리뷰 완료 후 Design Doc 작성

### 작성자
- 담당 개발자

### 작성 시점
- Tech Spec 리뷰 완료 후
- 태스크 생성 전

### 작성 예외
다음의 경우 Design Doc을 생략할 수 있다.
- 단순 UI 수정 (예: 버튼 색상 변경, 텍스트 수정)
- 기존 패턴 그대로 따르는 작업
- 기술적 의사결정이 없는 작업

---

## 프로세스별 가이드

이 프로젝트는 Electron 앱으로, FE/BE 대신 Main Process / Renderer Process로 구분합니다.

- [main.md](./main.md) - Main Process Design Doc 가이드
- [renderer.md](./renderer.md) - Renderer Process Design Doc 가이드

---

## Main-Renderer 협업

- IPC 변경이 있는 경우, Main Process Design Doc을 먼저 작성하거나 IPC 설계를 먼저 합의한다
- Renderer는 Main Design Doc의 IPC 설계를 참조한다

---

## 파일명 컨벤션

- 형식: `YYYYMMDD-kebab-case-name.md`
- 예시: `20250104-timezone-support.md`

---

## 공통 섹션

모든 Design Doc에 포함되어야 하는 섹션:

### Design (필수)
기술적 접근 방법을 설명한다.

### Alternatives considered (필수)
검토한 대안과 선택하지 않은 이유를 작성한다.
- 최소 1개 이상의 대안을 검토한다
- 각 대안의 장단점을 명시한다

### Cross-cutting concerns (필수)
성능, 보안 등 고려사항을 작성한다.
- 성능은 항상 고려한다
- 나머지는 프로젝트에 따라 선택적으로 작성한다

---

## 리뷰 체크리스트

리뷰어는 다음을 확인한다.

### Design
- [ ] 구조가 명확하게 설명되어 있는가
- [ ] 데이터 흐름이 이해되는가
- [ ] 더 나은 방법이 있는가

### Alternatives considered
- [ ] 대안이 1개 이상 검토되었는가
- [ ] 선택하지 않은 이유가 타당한가

### Cross-cutting concerns
- [ ] 성능 고려가 되어 있는가
- [ ] 해당 프로젝트에 필요한 항목이 빠지지 않았는가
