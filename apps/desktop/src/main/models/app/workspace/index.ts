import { join } from 'path'
import fs from 'fs-extra'
import { app } from 'electron'
import { WORKSPACE_PATHS } from './const.js'

/**
 * 워크스페이스 설정 조회를 위한 내부 헬퍼
 */
async function getWorkspaceConfig(): Promise<{ workspacePath: string }> {
  const configPath = join(app.getPath('userData'), 'config.json')
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
 * 사용자 워크스페이스 루트 경로
 * 앱 설정에서 로드
 */
export async function getWorkspacePath(): Promise<string> {
  const config = await getWorkspaceConfig()
  return config.workspacePath
}

/**
 * 워크스페이스 설정 파일 경로
 * @returns [workspace]/settings.json
 */
export async function getWorkspaceSettingsPath(): Promise<string> {
  const workspacePath = await getWorkspacePath()
  return join(workspacePath, WORKSPACE_PATHS.SETTINGS_FILE)
}

/**
 * 노드 메타데이터 디렉터리 경로
 * @returns [workspace]/nodes
 */
export async function getNodesPath(): Promise<string> {
  const workspacePath = await getWorkspacePath()
  return join(workspacePath, WORKSPACE_PATHS.NODES_DIR)
}

/**
 * 콘텐츠 파일 디렉터리 경로
 * @returns [workspace]/content
 */
export async function getContentPath(): Promise<string> {
  const workspacePath = await getWorkspacePath()
  return join(workspacePath, WORKSPACE_PATHS.CONTENT_DIR)
}

/**
 * 로그 파일 디렉터리 경로
 * @returns [workspace]/log
 */
export async function getLogPath(): Promise<string> {
  const workspacePath = await getWorkspacePath()
  return join(workspacePath, WORKSPACE_PATHS.LOG_DIR)
}