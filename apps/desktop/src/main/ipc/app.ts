import { dialog, BrowserWindow } from 'electron'
import { homedir } from 'os'
import { join } from 'path'
import * as AppModel from '../model/app/index.js'
import { CHANNELS } from '../../common/channel.const.js'

/**
 * 디렉터리 선택 다이얼로그 (Documents 초기 경로)
 */
async function openDirectoryDialog(
  event: Electron.IpcMainInvokeEvent,
): Promise<string | null> {
  const window = BrowserWindow.fromWebContents(event.sender)

  const result = await dialog.showOpenDialog(window!, {
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
async function isInitialized(): Promise<boolean> {
  try {
    return await AppModel.isInitialized()
  } catch (error) {
    console.error('Failed to check initialization status:', error)
    return false
  }
}

/**
 * 사용자 선택 경로로 앱 초기화 (첫 실행)
 */
async function handleInitializeApp(
  _event: Electron.IpcMainInvokeEvent,
  workspaceDirPath: string,
): Promise<void> {
  try {
    await AppModel.initializeApp({ workspaceDirPath })
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error
    }

    throw new Error('Failed to initialize app')
  }
}

async function handleSyncApp(): Promise<void> {
  try {
    await AppModel.sync()
  } catch (error) {
    throw new Error((error as Error).message || 'Failed to sync app')
  }
}

/**
 * 앱 관련 IPC 핸들러 등록
 */
export default function registerAppHandlers(ipcMain: Electron.IpcMain): void {
  // 앱 초기화 상태 확인
  ipcMain.handle(CHANNELS.IS_INITIALIZED, isInitialized)

  // 워크스페이스 경로 선택
  ipcMain.handle(CHANNELS.SELECT_WORKSPACE_DIR_PATH, openDirectoryDialog)

  // 앱 초기화 (첫 실행)
  ipcMain.handle(CHANNELS.INITIALIZE_APP, handleInitializeApp)

  // 앱 동기화
  ipcMain.handle(CHANNELS.SYNC_APP, handleSyncApp)
}
