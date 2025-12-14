# 회고: Main Process 글로벌 에러 핸들러 추가

- **일시**: 2025-11-30
- **워크플로우**: new-feature
- **결과**: 성공

## 호출된 Agent
- code-analyzer: 기존 에러 핸들링 현황 분석
- tester: typecheck, lint, build 검증

## 잘된 점
- 간단한 기능이라 불필요한 generator 호출 없이 직접 구현
- 기존 logger 인프라를 효과적으로 재사용
- 검증 단계에서 문제 없이 통과 (typecheck, lint, build)
- 에러 레벨 구분이 명확함 (uncaughtException: fatal, unhandledRejection: error)

## 문제점
- whiteboard에 작업 컨텍스트가 기록되지 않음 (context.md 없음)
- doc-updater 단계 생략: 문서 업데이트 필요성에 대한 명확한 판단 기준 부족
- doc-compiler 단계 생략: 새 기능 개발 워크플로우에 포함되어야 하나 누락됨
- 에러 핸들러 자체에 대한 테스트 계획 없음 (의도적으로 에러 발생시켜 로깅 확인)
- Renderer process에 대한 동일한 에러 핸들링 필요성 검토 안됨

## 개선 아이디어
- 워크플로우 체크리스트 강제: 새 기능 개발 시 doc-updater, doc-compiler 단계를 선택사항이 아닌 필수로 명시
- whiteboard 기록 누락 감지: retrospector 실행 전 context.md 존재 여부 확인 및 경고
- 에러 핸들러 검증 가이드: 런타임 동작 확인이 필요한 코드(에러 핸들러, 로거 등)에 대한 수동 테스트 체크리스트 제공
- 대칭성 검토 프롬프트: Main/Renderer 양쪽에 적용 가능한 기능 추가 시 자동으로 반대편도 검토하도록 안내