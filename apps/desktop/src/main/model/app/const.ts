/**
 * 앱 레벨 경로 상수 (캡슐화됨)
 * 외부에서 직접 접근 불가, 경로 함수를 통해서만 사용
 */
export const APP_PATHS = {
  CONFIG_FILE: 'config.json', // 앱 설정 (workspaceDirPath 포함)
} as const

export const APP_VERSION = '1.0.0'
