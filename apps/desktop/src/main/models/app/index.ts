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
  return fs.pathExists(getConfigPath())
}

// 앱 설정 싱글톤 메모리 관리
let appConfig: { workspacePath: string } | null = null

/**
 * 메모리에서 앱 설정 조회 (싱글톤)
 */
export function getAppConfig(): { workspacePath: string } | null {
  return appConfig
}

/**
 * 메모리에 앱 설정 저장 (싱글톤)
 */
export function setAppConfig(config: { workspacePath: string } | null): void {
  appConfig = config
}

/**
 * 파일에서 앱 설정 로드하여 메모리에 저장
 */
export async function loadAppConfig(): Promise<{ workspacePath: string }> {
  const configPath = getConfigPath()
  if (!(await fs.pathExists(configPath))) {
    throw new Error('App configuration not found. Initialization required.')
  }
  const config = await fs.readJson(configPath)
  if (!config.workspacePath) {
    throw new Error('Workspace path not configured.')
  }
  setAppConfig(config)
  return config
}

/**
 * 앱 설정 기반 워크스페이스 초기화 (IPC에서 호출)
 * @returns 초기화된 워크스페이스 경로
 */
export async function initializeFromConfig(): Promise<string> {
  const config = await loadAppConfig()

  // 워크스페이스 초기화 (경로 검사 + 디렉터리 생성 + 설정)
  await initializeWorkspace({ workspacePath: config.workspacePath })

  return config.workspacePath
}

/**
 * 앱 초기화 (첫 실행 - 설정 생성만)
 * @param workspacePath 사용자가 선택한 경로
 */
export async function initializeApp({ workspacePath }: { workspacePath: string }): Promise<void> {
  // 1. 앱 설정을 파일에 저장
  await saveAppConfigToFile({ workspacePath })
  // 2. 워크스페이스 초기화 (폴더 구조 생성 + 권한 확인)
  await initializeWorkspace({ workspacePath })
  // 초기화 완료: DB 초기화는 loadApp()에서 별도로 수행
}

/**
 * 앱 로드 (설정 로드 + DB 초기화)
 */
export async function loadApp(): Promise<void> {
  // 1. config 파일에서 메모리로 로드 (이미 메모리에 있다면 파일에서 다시 로드)
  await loadAppConfig()
  // 2. 캐시 DB 초기화는 별도로 구현 예정
  // const cachePath = getCachePath()
  // await initializeDB(cachePath)
}

/**
 * 앱 설정을 파일에 저장
 */
async function saveAppConfigToFile(config: { workspacePath: string }): Promise<void> {
  const configPath = getConfigPath()
  const fullConfig = {
    version: '1.0.0',
    workspacePath: config.workspacePath,
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
  }

  await fs.writeJson(configPath, fullConfig, { spaces: 2 })
}
