# main/window 구조

## 개요

window는 애플리케이션 창의 생성과 관리를 담당합니다.

## 구조

```
window/
└── index.ts    # 창 관리 기능
```

### 구성요소

- 창 생성, 크기 조정, 닫기 등의 윈도우 관리 기능
- 멀티 윈도우 지원을 위한 윈도우 상태 관리
- Electron BrowserWindow API를 추상화하여 제공

## Import 규칙

- common만 import 가능
