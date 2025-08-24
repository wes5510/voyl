import { app } from 'electron'
import { join } from 'path'
import fs from 'fs-extra'
import { APP_PATHS } from './const.js'
import { initializeWorkspace } from './workspace/index.js'

/**
 * 앱 설정 파일 경로
 * @returns ~/Library/Application Support/voyl/config.json
 */
export function getConfigPath(): string {
  return join(app.getPath('userData'), APP_PATHS.CONFIG_FILE)
}

/**
 * SQLite 캐시 데이터베이스 경로
 * @returns ~/Library/Application Support/voyl/cache.db
 */
export function getCachePath(): string {
  return join(app.getPath('userData'), APP_PATHS.CACHE_FILE)
}

/**
 * 앱 초기화 상태 확인
 * 비동기로 통일하여 일관성 유지
 */
export async function isInitialized(): Promise<boolean> {
  const configPath = getConfigPath()
  const exists = fs.existsSync(configPath)
  console.log('Config path:', configPath)
  console.log('Config exists:', exists)
  return exists
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

/**
 * 앱 초기화 (설정 저장 + 워크스페이스 생성)
 */
export async function initializeApp(workspacePath: string): Promise<void> {
  // 1. 앱 설정 저장
  const config = { workspacePath }
  await fs.writeJson(getConfigPath(), config, { spaces: 2 })

  // 2. 워크스페이스 초기화
  await initializeWorkspace(workspacePath)
}

/**
 * 앱 로드 (기존 설정으로 초기화)
 */
export async function loadApp(): Promise<void> {
  const config = await loadAppConfig()
  if (!config.workspacePath) {
    throw new Error('No workspace configured')
  }

  // 워크스페이스 유효성 검증
  if (!fs.existsSync(config.workspacePath)) {
    throw new Error(`Workspace not found: ${config.workspacePath}`)
  }

  // 캐시 DB 초기화
  const { initialize } = await import('../../db/index.js')
  const cachePath = getCachePath()
  await initialize(cachePath)
}

// 워크스페이스 초기화만 내부적으로 사용
