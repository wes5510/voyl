import * as AppConst from './const.js'
import { initializeWorkspace } from './workspace/index.js'
import * as AppRepo from '../../repo/app/index.js'

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
export async function initializeApp({ workspacePath }: { workspacePath: string }): Promise<void> {
  // 1. 앱 설정 생성
  await AppRepo.create({
    workspacePath,
    version: AppConst.APP_VERSION,
  })
  // 2. 워크스페이스 초기화 (폴더 구조 생성 + 권한 확인)
  await initializeWorkspace({ workspacePath })
  // 초기화 완료: DB 초기화는 loadApp()에서 별도로 수행
}
