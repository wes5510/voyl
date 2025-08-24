import { dialog, ipcMain } from 'electron'
import { homedir } from 'os'
import { join } from 'path'
import { initializeApp, loadApp, isInitialized } from '../models/app/index.js'
import { CHANNELS } from '../../common/channel.const.js'

/**
 * 디렉터리 선택 다이얼로그 (Documents 초기 경로)
 */
async function openDirectoryDialog(): Promise<string | null> {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
    title: 'Select Workspace Location',
    buttonLabel: 'Select',
    defaultPath: join(homedir(), 'Documents'),
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  return result.filePaths[0]
}

/**
 * 앱 초기화 상태 확인
 */
async function checkIsInitialized(): Promise<boolean> {
  try {
    return await isInitialized()  // 비동기 함수로 통일
  } catch (error) {
    console.error('Failed to check initialization status:', error)
    return false
  }
}

/**
 * 사용자 선택 경로로 앱 초기화 (첫 실행)
 */
async function handleInitializeApp(_event: Electron.IpcMainInvokeEvent, workspacePath: string): Promise<void> {
  try {
    await initializeApp({ workspacePath })
  } catch (error) {
    throw new Error((error as Error).message || 'Failed to initialize app')
  }
}

/**
 * 앱 로드 (일반 실행)
 */
async function handleLoadApp(): Promise<void> {
  try {
    await loadApp()
  } catch (error) {
    throw new Error((error as Error).message || 'Failed to load app')
  }
}

/**
 * 앱 관련 IPC 핸들러 등록
 */
export default function registerAppHandlers(): void {
  // 앱 초기화 상태 확인
  ipcMain.handle(CHANNELS.IS_INITIALIZED, checkIsInitialized)

  // 워크스페이스 경로 선택
  ipcMain.handle(CHANNELS.SELECT_WORKSPACE_PATH, openDirectoryDialog)
  
  // 앱 초기화 (첫 실행)
  ipcMain.handle(CHANNELS.INITIALIZE_APP, handleInitializeApp)
  
  // 앱 로드 (일반 실행)
  ipcMain.handle(CHANNELS.LOAD_APP, handleLoadApp)
}