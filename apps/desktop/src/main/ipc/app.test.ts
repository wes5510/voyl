import { describe, it, expect, beforeEach, vi } from 'vitest'
import { dialog } from 'electron'
import { join } from 'path'
import registerAppHandlers from './app.js'
import { CHANNELS } from '../../common/channel.const.js'

// Mock electron
vi.mock('electron', () => ({
  dialog: {
    showOpenDialog: vi.fn(),
  },
  BrowserWindow: {
    fromWebContents: vi.fn(() => null),
  },
}))

// Mock ipcMain for testing
const mockIpcMain = {
  handle: vi.fn(),
} as unknown as Electron.IpcMain

// Mock os
vi.mock('os', () => ({
  default: {
    homedir: vi.fn(() => '/home/user'),
  },
  homedir: vi.fn(() => '/home/user'),
}))

// Mock models
vi.mock('../model/app/index.js', () => ({
  isInitialized: vi.fn(),
  initializeApp: vi.fn(),
}))

describe('App IPC Handlers', () => {
  // 핸들러 찾기 유틸 함수
  function getHandler(channel: string) {
    const result = vi.mocked(mockIpcMain.handle).mock.calls.find(([c]) => c === channel)?.[1]
    if (!result) {
      throw new Error(`Handler not found for channel: ${channel}`)
    }
    return result
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('registerAppHandlers', () => {
    it('앱 핸들러 등록 시 모든 IPC 채널이 등록되어야 함', () => {
      registerAppHandlers(mockIpcMain)

      expect(mockIpcMain.handle).toHaveBeenCalledWith(CHANNELS.IS_INITIALIZED, expect.any(Function))
      expect(mockIpcMain.handle).toHaveBeenCalledWith(
        CHANNELS.SELECT_WORKSPACE_DIR_PATH,
        expect.any(Function),
      )
      expect(mockIpcMain.handle).toHaveBeenCalledWith(CHANNELS.INITIALIZE_APP, expect.any(Function))
    })
  })

  describe('openDirectoryDialog', () => {
    it('경로 선택 시 Documents 기본 경로로 다이얼로그가 열려야 함', async () => {
      vi.mocked(dialog.showOpenDialog).mockResolvedValue({
        canceled: false,
        filePaths: ['/selected/path'],
      })

      // Register handlers and get the function
      registerAppHandlers(mockIpcMain)
      const selectPathHandler = getHandler(CHANNELS.SELECT_WORKSPACE_DIR_PATH)

      const mockEvent = { sender: {} } as Electron.IpcMainInvokeEvent
      const result = await selectPathHandler(mockEvent)

      expect(dialog.showOpenDialog).toHaveBeenCalledWith(null, {
        properties: ['openDirectory', 'createDirectory'],
        title: 'Select Workspace Location',
        buttonLabel: 'Select',
        defaultPath: join('/home/user', 'Documents'),
      })
      expect(result).toBe('/selected/path')
    })

    it('다이얼로그 취소 시 null을 반환해야 함', async () => {
      vi.mocked(dialog.showOpenDialog).mockResolvedValue({
        canceled: true,
        filePaths: [],
      })

      registerAppHandlers(mockIpcMain)
      const selectPathHandler = getHandler(CHANNELS.SELECT_WORKSPACE_DIR_PATH)

      const mockEvent = { sender: {} } as Electron.IpcMainInvokeEvent
      const result = await selectPathHandler(mockEvent)
      expect(result).toBeNull()
    })
  })

  describe('checkIsInitialized', () => {
    it('앱 초기화 상태 확인 시 초기화되어 있으면 true를 반환해야 함', async () => {
      const AppModel = await import('../model/app/index.js')
      vi.mocked(AppModel.isInitialized).mockResolvedValue(true)

      registerAppHandlers(mockIpcMain)
      const handler = getHandler(CHANNELS.IS_INITIALIZED)

      const result = await handler({} as Electron.IpcMainInvokeEvent)
      expect(result).toBe(true)
    })

    it('앱 초기화 상태 확인 중 에러 발생 시 false를 반환해야 함', async () => {
      const AppModel = await import('../model/app/index.js')
      vi.mocked(AppModel.isInitialized).mockRejectedValue(new Error('Test error'))

      registerAppHandlers(mockIpcMain)
      const handler = getHandler(CHANNELS.IS_INITIALIZED)

      const result = await handler({} as Electron.IpcMainInvokeEvent)
      expect(result).toBe(false)
    })
  })

  describe('handleInitializeApp', () => {
    it('앱 초기화 요청 시 성공적으로 초기화되어야 함', async () => {
      const AppModel = await import('../model/app/index.js')
      vi.mocked(AppModel.initializeApp).mockResolvedValue(undefined)

      registerAppHandlers(mockIpcMain)
      const handler = getHandler(CHANNELS.INITIALIZE_APP)

      const mockEvent = {} as Electron.IpcMainInvokeEvent
      await expect(handler(mockEvent, '/test/path')).resolves.not.toThrow()

      expect(AppModel.initializeApp).toHaveBeenCalledWith({ workspaceDirPath: '/test/path' })
    })

    it('앱 초기화 실패 시 에러를 던져야 함', async () => {
      const AppModel = await import('../model/app/index.js')
      vi.mocked(AppModel.initializeApp).mockRejectedValue(new Error('Init failed'))

      registerAppHandlers(mockIpcMain)
      const handler = getHandler(CHANNELS.INITIALIZE_APP)

      const mockEvent = {} as Electron.IpcMainInvokeEvent
      await expect(handler(mockEvent, '/test/path')).rejects.toThrow('Init failed')
    })
  })
})
