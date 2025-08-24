/**
 * 앱 레벨 경로 상수 (캡슐화됨)
 * 외부에서 직접 접근 불가, 경로 함수를 통해서만 사용
 */
const APP_PATHS = {
  CONFIG_FILE: 'config.json', // 앱 설정 (workspacePath 포함)
  CACHE_FILE: 'cache.db', // SQLite 캐시 (기존 database.sqlite에서 변경)
} as const

export { APP_PATHS }