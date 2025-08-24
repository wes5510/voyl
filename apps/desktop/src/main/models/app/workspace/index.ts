import { join } from 'path'
import path from 'path'
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

/**
 * 워크스페이스 권한 확인
 */
export async function checkWorkspacePermissions({
  workspacePath,
}: {
  workspacePath: string
}): Promise<void> {
  try {
    // 1. 경로 존재 확인 및 생성
    await fs.ensureDir(workspacePath)

    // 2. 읽기/쓰기 권한 확인
    await fs.access(workspacePath, fs.constants.R_OK | fs.constants.W_OK)

    // 3. 실제 쓰기 테스트
    const testFile = join(workspacePath, '.test-write-permission')
    await fs.writeFile(testFile, 'test')
    await fs.remove(testFile)
  } catch (error) {
    throw new Error(`Insufficient permissions for workspace: ${workspacePath}`)
  }
}

/**
 * 워크스페이스 전체 초기화 조정자
 * 최소 초기화: 필수 디렉터리 확인/생성
 * 실패 시 자동 정리 수행
 */
export async function initializeWorkspace({
  workspacePath,
}: {
  workspacePath: string
}): Promise<void> {
  try {
    // 순차적 초기화 (의존성 고려)
    await validateWorkspacePath({ workspacePath })
    await checkWorkspacePermissions({ workspacePath })
    await initDirectories({ workspacePath }) // 최소 초기화: 필수 디렉터리
    await initSettings({ workspacePath }) // 최소 초기화: 기본 설정 파일
  } catch (error) {
    // 초기화 실패 시 정리
    await cleanupFailedInitialization({ workspacePath })
    throw error
  }
}

/**
 * 워크스페이스 경로 검증 (권한 체크는 별도 함수에서 수행)
 */
async function validateWorkspacePath({ workspacePath }: { workspacePath: string }): Promise<void> {
  // 기본적인 경로 유효성 검증
  if (!workspacePath || workspacePath.trim() === '') {
    throw new Error('Workspace path cannot be empty')
  }

  // 절대 경로 확인
  if (!path.isAbsolute(workspacePath)) {
    throw new Error('Workspace path must be absolute')
  }
}

/**
 * 워크스페이스 내 필요한 디렉터리들을 병렬 생성
 */
async function initDirectories({ workspacePath }: { workspacePath: string }): Promise<void> {
  const directories = [
    join(workspacePath, WORKSPACE_PATHS.NODES_DIR),
    join(workspacePath, WORKSPACE_PATHS.CONTENT_DIR),
    join(workspacePath, WORKSPACE_PATHS.LOG_DIR),
  ]

  // 병렬 생성으로 성능 최적화
  await Promise.all(directories.map((dir) => fs.ensureDir(dir)))
}

/**
 * 워크스페이스 설정 파일 생성/검증
 */
async function initSettings({ workspacePath }: { workspacePath: string }): Promise<void> {
  const settingsPath = join(workspacePath, WORKSPACE_PATHS.SETTINGS_FILE)

  if (!(await fs.pathExists(settingsPath))) {
    const defaultSettings = createDefaultSettings()
    await fs.writeJson(settingsPath, defaultSettings, { spaces: 2 })
  }
}

/**
 * 기본 워크스페이스 설정 생성
 */
function createDefaultSettings() {
  return {
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    nodeTypes: [], // Node type definitions (빈 배열로 시작)
    attributes: [], // Attribute definitions (빈 배열로 시작)
    // 향후 확장: 테마, 언어, 플러그인 등
  }
}

/**
 * 실패한 초기화 정리 - 생성된 모든 항목 강제 삭제
 */
async function cleanupFailedInitialization({
  workspacePath,
}: {
  workspacePath: string
}): Promise<void> {
  const itemsToCleanup = [
    // 파일들
    join(workspacePath, WORKSPACE_PATHS.SETTINGS_FILE),

    // 디렉터리들
    join(workspacePath, WORKSPACE_PATHS.NODES_DIR),
    join(workspacePath, WORKSPACE_PATHS.CONTENT_DIR),
    join(workspacePath, WORKSPACE_PATHS.LOG_DIR),
  ]

  // 모든 항목 삭제 시도 (존재하지 않아도 에러 안남)
  await Promise.allSettled(itemsToCleanup.map((item) => fs.remove(item)))

  // 워크스페이스 폴더가 비어있다면 삭제
  try {
    const files = await fs.readdir(workspacePath)
    if (files.length === 0) {
      await fs.remove(workspacePath)
    }
  } catch {
    // 삭제 실패해도 무시
    console.warn('Failed to cleanup incomplete workspace initialization')
  }
}