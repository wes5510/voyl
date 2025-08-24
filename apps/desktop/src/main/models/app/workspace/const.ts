/**
 * 워크스페이스 레벨 경로 상수 (캡슐화됨)
 * 외부에서 직접 접근 불가, 경로 함수를 통해서만 사용
 */
const WORKSPACE_PATHS = {
  SETTINGS_FILE: 'settings.json', // 워크스페이스 설정
  NODES_DIR: 'nodes', // 노드 메타데이터 (향후)
  CONTENT_DIR: 'content', // 긴 본문 파일 (향후)
  LOG_DIR: 'log', // 변경 이력 (향후)
} as const

export { WORKSPACE_PATHS }