# Context: Zustand to Valtio Migration

## Task Overview
Zustand에서 Valtio로 상태 관리 라이브러리를 마이그레이션합니다.

## Task Type
Refactoring

## Objectives
1. 현재 Zustand 사용 현황 파악
2. Valtio로 마이그레이션 계획 수립
3. 실제 마이그레이션 구현
4. 의존성 변경 (package.json)
5. 타입체크, 린트, 빌드 통과

## Key Information
- **프로젝트**: Electron 앱, monorepo (pnpm workspace)
- **메인 앱**: apps/desktop/
- **상태 관리 위치**: apps/desktop/src/renderer/store/
- **현재 상태 관리**: Zustand + React Query
- **목표 상태 관리**: Valtio + React Query

## Reference Documents
- Project overview: apps/desktop/docs/project.md
- Layer guide: apps/desktop/docs/guide/layer/index.md
- Renderer layer guide: apps/desktop/docs/guide/layer/renderer/index.md

## Agents Involved
1. code-analyzer: Zustand 사용 현황 분석
2. planner: 마이그레이션 계획 수립
3. Common generators: 타입 정의, 유틸리티 변경
4. FE generators: Store 레이어 마이그레이션
5. tester: 검증
6. git-agent: 최종 커밋 및 PR

## Notes
- Valtio는 mutable 스타일의 상태 관리 라이브러리
- Zustand와 달리 proxy 기반으로 동작
- React Query는 유지 (서버 상태 관리)