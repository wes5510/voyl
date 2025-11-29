import { describe, it, expect, beforeEach, vi } from 'vitest'
import { dialog } from 'electron'
import { join } from 'path'
import { appHandlers } from './app.js'

// Mock electron
vi.mock('electron', () => ({
  dialog: {
    showOpenDialog: vi.fn(),
  },
  BrowserWindow: {
    fromWebContents: vi.fn(() => null),
    getFocusedWindow: vi.fn(() => null),
  },
}))


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
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('app.selectWorkspaceDirPath', () => {
    it('경로 선택 시 Documents 기본 경로로 다이얼로그가 열려야 함', async () => {
      vi.mocked(dialog.showOpenDialog).mockResolvedValue({
        canceled: false,
        filePaths: ['/selected/path'],
      })

      const result = await appHandlers['app.selectWorkspaceDirPath']()

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

      const result = await appHandlers['app.selectWorkspaceDirPath']()
      expect(result).toBeNull()
    })
  })

  describe('app.isInitialized', () => {
    it('앱 초기화 상태 확인 시 초기화되어 있으면 true를 반환해야 함', async () => {
      const AppModel = await import('../model/app/index.js')
      vi.mocked(AppModel.isInitialized).mockResolvedValue(true)

      const result = await appHandlers['app.isInitialized']()
      expect(result).toBe(true)
    })

    it('앱 초기화 상태 확인 중 에러 발생 시 false를 반환해야 함', async () => {
      const AppModel = await import('../model/app/index.js')
      vi.mocked(AppModel.isInitialized).mockRejectedValue(new Error('Test error'))

      const result = await appHandlers['app.isInitialized']()
      expect(result).toBe(false)
    })
  })

  describe('app.initialize', () => {
    it('앱 초기화 요청 시 성공적으로 초기화되어야 함', async () => {
      const AppModel = await import('../model/app/index.js')
      vi.mocked(AppModel.initializeApp).mockResolvedValue(undefined)

      await expect(appHandlers['app.initialize']('/test/path')).resolves.not.toThrow()

      expect(AppModel.initializeApp).toHaveBeenCalledWith({ workspaceDirPath: '/test/path' })
    })

    it('앱 초기화 실패 시 에러를 던져야 함', async () => {
      const AppModel = await import('../model/app/index.js')
      vi.mocked(AppModel.initializeApp).mockRejectedValue(new Error('Init failed'))

      await expect(appHandlers['app.initialize']('/test/path')).rejects.toThrow('Init failed')
    })
  })
})
