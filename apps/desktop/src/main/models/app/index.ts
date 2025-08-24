import { app } from 'electron'
import { join } from 'path'
import fs from 'fs-extra'
import { APP_PATHS } from './const.js'

/**
 * 앱 설정 파일 경로
 * @returns ~/Library/Application Support/voyl/config.json
 */
export function getConfigPath(): string {
  return join(app.getPath('userData'), APP_PATHS.CONFIG_FILE)
}

/**
 * SQLite 캐시 데이터베이스 경로
 * @returns ~/Library/Caches/voyl/cache.db (캐시 전용 디렉터리)
 */
export function getCachePath(): string {
  return join(app.getPath('userData'), APP_PATHS.CACHE_FILE)
}

/**
 * 앱 초기화 상태 확인
 * 비동기로 통일하여 일관성 유지
 */
export async function isInitialized(): Promise<boolean> {
  return fs.existsSync(getConfigPath())
}

/**
 * 앱 설정 로드
 */
export async function loadAppConfig(): Promise<{ workspacePath: string }> {
  const configPath = getConfigPath()
  if (!fs.existsSync(configPath)) {
    throw new Error('App configuration not found. Initialization required.')
  }
  const config = await fs.readJson(configPath)
  if (!config.workspacePath) {
    throw new Error('Workspace path not configured.')
  }
  return config
}
