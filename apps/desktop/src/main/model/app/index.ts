import AppRepo from '../../repo/app/index.js'
import SyncMetadataRepo from '../../repo/syncMetadata/index.js'
import { APP_VERSION } from './const.js'
import WorkspaceModel from './workspace/index.js'
import NodeModel from '../node/index.js'
import TreeModel from '../tree/index.js'

/**
 * 앱 초기화 상태 확인
 * 비동기로 통일하여 일관성 유지
 */
async function isInitialized(): Promise<boolean> {
  const exists = await AppRepo.exists()
  return exists
}

/**
 * 앱 초기화 (첫 실행 - 설정 생성만)
 * @param workspaceDirPath 사용자가 선택한 경로
 */
async function initializeApp({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  await SyncMetadataRepo.initialize()
  await AppRepo.initialize({
    workspaceDirPath,
    version: APP_VERSION,
  })
  await WorkspaceModel.initialize({ workspaceDirPath })
  await TreeModel.initialize({ workspaceDirPath })
}

async function sync(): Promise<void> {
  await AppRepo.sync()

  const workspaceDirPath = await AppRepo.getWorkspaceDirPath()
  if (!workspaceDirPath) {
    throw new Error('Workspace directory path not found')
  }

  await WorkspaceModel.sync({ workspaceDirPath })
  await NodeModel.sync({ workspaceDirPath })
}

const AppModel = {
  isInitialized,
  initializeApp,
  sync,
}

export default AppModel
