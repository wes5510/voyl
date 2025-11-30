# Logger Source Location 추가

## 목표

Logger에 파일명과 라인 번호를 자동으로 추가하여 디버깅 편의성 향상

## 현재 상태

- Logger: `pino` 라이브러리 사용
- 위치: `apps/desktop/src/main/common/logger.util.ts`
- 사용처: Main process 전역

## 요구사항

로그 출력 시 파일명과 라인 번호를 자동으로 포함:
```
[DEBUG] (src/main/model/treeView/index.ts:136) Remove Node { nodeId: "..." }
```

## 접근 방법

1. V8 Stack Trace API 활용
2. pino custom logger 또는 wrapper 구현
3. 성능 영향 최소화 (개발 환경에서만 활성화 고려)

## 제약사항

- 기존 logger 호출 코드 변경 최소화
- TypeScript strict mode 준수
- 프로덕션 빌드 성능 영향 없어야 함
