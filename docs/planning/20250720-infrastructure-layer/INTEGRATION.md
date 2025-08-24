# 앱 시작 통합 완료

## 구현 완료 사항

### 1. DB 지연 초기화
- `db/connect.ts`를 지연 초기화 패턴으로 변경
- `initializeDatabase()`: DB 연결 초기화
- `getDatabase()`: DB 인스턴스 반환
- `closeDatabase()`: DB 연결 종료

### 2. 앱 시작 플로우
- main/index.ts에서 db/connect.js import 제거
- DB는 loadApp() 호출 시점에 초기화
- 앱 종료 시 DB 연결 정리

### 3. 전체 플로우

#### 첫 실행
1. 앱 시작 → IPC 핸들러 등록
2. 프론트엔드 → `isInitialized()` → false
3. `StorageLocationDialog` 표시
4. 경로 선택 → `initializeApp(path)`
5. 워크스페이스 생성
6. `loadApp()` → DB 초기화
7. 메인 화면 진입

#### 기존 사용자
1. 앱 시작 → IPC 핸들러 등록
2. 프론트엔드 → `isInitialized()` → true
3. `loadApp()` → DB 초기화
4. 메인 화면 진입

## 파일 변경 사항

### 수정된 파일
- `src/main/index.ts`: DB import 제거, 종료 시 정리
- `src/main/db/connect.ts`: 지연 초기화 패턴
- `src/main/models/app/index.ts`: loadApp에서 DB 초기화

### 추가된 파일
- 모든 UI 컴포넌트 (PR 4)
- IPC 핸들러 (PR 3)
- 워크스페이스 초기화 (PR 2)
- 경로 관리 유틸리티 (PR 1)

## 테스트 방법

1. 기존 config 파일 삭제
```bash
rm ~/Library/Application\ Support/voyl/config.json
```

2. 앱 실행
```bash
pnpm dev
```

3. 워크스페이스 선택 다이얼로그 확인
4. 경로 선택 후 초기화 확인
5. 앱 재시작 시 바로 메인 화면 진입 확인