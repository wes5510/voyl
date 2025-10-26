import * as AppRepo from '../../repo/app/index.js'
import * as SyncMetadataRepo from '../../repo/syncMetadata/index.js'
import { APP_VERSION } from './const.js'
import * as WorkspaceRepo from '../../repo/workspace/index.js'

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
 * @param workspacePath 사용자가 선택한 경로
 */
export async function initializeApp({
  workspacePath,
}: {
  workspacePath: string
}): Promise<void> {
  await SyncMetadataRepo.initialize()
  await AppRepo.initialize({
    workspacePath,
    version: APP_VERSION,
  })
  await WorkspaceRepo.initialize()
}

export async function sync(): Promise<void> {
  await AppRepo.sync()
}
