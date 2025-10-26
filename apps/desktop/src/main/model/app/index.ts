import * as AppRepo from '../../repo/app/index.js'
import * as SyncMetadataRepo from '../../repo/syncMetadata/index.js'
import { APP_VERSION } from './const.js'
import * as WorkspaceRepo from '../../repo/workspace/index.js'
import * as NodeRepo from '../../repo/node/index.js'

/**
 * 앱 초기화 상태 확인
 * 비동기로 통일하여 일관성 유지
 */
export async function isInitialized(): Promise<boolean> {
  const exists = await AppRepo.exists()
  return exists
}

/**
 * 앱 초기화 (첫 실행 - 설정 생성만)
 * @param workspaceDirPath 사용자가 선택한 경로
 */
export async function initializeApp({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  await SyncMetadataRepo.initialize()
  await AppRepo.initialize({
    workspaceDirPath,
    version: APP_VERSION,
  })
  await WorkspaceRepo.initialize({ workspaceDirPath })
  await NodeRepo.initialize({ workspaceDirPath })
}

export async function sync(): Promise<void> {
  await AppRepo.sync()

  const workspaceDirPath = await AppRepo.getWorkspaceDirPath()
  if (!workspaceDirPath) {
    throw new Error('Workspace directory path not found')
  }

  WorkspaceRepo.initializePath({ workspaceDirPath })
  await WorkspaceRepo.sync()

  NodeRepo.initializePath({ workspaceDirPath })
  await NodeRepo.sync()
}
