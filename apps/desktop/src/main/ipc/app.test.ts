import { describe, it, expect, beforeEach, vi } from 'vitest'
import { dialog, ipcMain } from 'electron'
import { homedir } from 'os'
import { join } from 'path'
import registerAppHandlers from './app.js'
import { CHANNELS } from '../../common/channel.const.js'

// Mock electron
vi.mock('electron', () => ({
  dialog: {
    showOpenDialog: vi.fn(),
  },
  ipcMain: {
    handle: vi.fn(),
  },
}))

// Mock os
vi.mock('os', () => ({
  homedir: vi.fn(() => '/home/user'),
}))

// Mock models
vi.mock('../models/app/index.js', () => ({
  isInitialized: vi.fn(),
  initializeApp: vi.fn(),
  loadApp: vi.fn(),
}))

describe('App IPC Handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('registerAppHandlers', () => {
    it('should register all app handlers', () => {
      registerAppHandlers()

      expect(ipcMain.handle).toHaveBeenCalledWith(
        CHANNELS.IS_INITIALIZED,
        expect.any(Function)
      )
      expect(ipcMain.handle).toHaveBeenCalledWith(
        CHANNELS.SELECT_WORKSPACE_PATH,
        expect.any(Function)
      )
      expect(ipcMain.handle).toHaveBeenCalledWith(
        CHANNELS.INITIALIZE_APP,
        expect.any(Function)
      )
      expect(ipcMain.handle).toHaveBeenCalledWith(
        CHANNELS.LOAD_APP,
        expect.any(Function)
      )
    })
  })

  describe('openDirectoryDialog', () => {
    it('should open dialog with Documents default path', async () => {
      vi.mocked(dialog.showOpenDialog).mockResolvedValue({
        canceled: false,
        filePaths: ['/selected/path'],
      })

      // Register handlers and get the function
      registerAppHandlers()
      const selectPathHandler = vi.mocked(ipcMain.handle).mock.calls.find(
        ([channel]) => channel === CHANNELS.SELECT_WORKSPACE_PATH
      )?.[1]

      const result = await selectPathHandler?.()
      
      expect(dialog.showOpenDialog).toHaveBeenCalledWith({
        properties: ['openDirectory', 'createDirectory'],
        title: 'Select Workspace Location',
        buttonLabel: 'Select',
        defaultPath: join('/home/user', 'Documents'),
      })
      expect(result).toBe('/selected/path')
    })

    it('should return null when dialog is canceled', async () => {
      vi.mocked(dialog.showOpenDialog).mockResolvedValue({
        canceled: true,
        filePaths: [],
      })

      registerAppHandlers()
      const selectPathHandler = vi.mocked(ipcMain.handle).mock.calls.find(
        ([channel]) => channel === CHANNELS.SELECT_WORKSPACE_PATH
      )?.[1]

      const result = await selectPathHandler?.()
      expect(result).toBeNull()
    })
  })

  describe('checkIsInitialized', () => {
    it('should return true when app is initialized', async () => {
      const { isInitialized } = await import('../models/app/index.js')
      vi.mocked(isInitialized).mockResolvedValue(true)

      registerAppHandlers()
      const handler = vi.mocked(ipcMain.handle).mock.calls.find(
        ([channel]) => channel === CHANNELS.IS_INITIALIZED
      )?.[1]

      const result = await handler?.()
      expect(result).toBe(true)
    })

    it('should return false on error', async () => {
      const { isInitialized } = await import('../models/app/index.js')
      vi.mocked(isInitialized).mockRejectedValue(new Error('Test error'))

      registerAppHandlers()
      const handler = vi.mocked(ipcMain.handle).mock.calls.find(
        ([channel]) => channel === CHANNELS.IS_INITIALIZED
      )?.[1]

      const result = await handler?.()
      expect(result).toBe(false)
    })
  })

  describe('handleInitializeApp', () => {
    it('should initialize app successfully', async () => {
      const { initializeApp } = await import('../models/app/index.js')
      vi.mocked(initializeApp).mockResolvedValue(undefined)

      registerAppHandlers()
      const handler = vi.mocked(ipcMain.handle).mock.calls.find(
        ([channel]) => channel === CHANNELS.INITIALIZE_APP
      )?.[1]

      const mockEvent = {} as Electron.IpcMainInvokeEvent
      await expect(handler?.(mockEvent, '/test/path')).resolves.not.toThrow()
      
      expect(initializeApp).toHaveBeenCalledWith({ workspacePath: '/test/path' })
    })

    it('should throw error on failure', async () => {
      const { initializeApp } = await import('../models/app/index.js')
      vi.mocked(initializeApp).mockRejectedValue(new Error('Init failed'))

      registerAppHandlers()
      const handler = vi.mocked(ipcMain.handle).mock.calls.find(
        ([channel]) => channel === CHANNELS.INITIALIZE_APP
      )?.[1]

      const mockEvent = {} as Electron.IpcMainInvokeEvent
      await expect(handler?.(mockEvent, '/test/path')).rejects.toThrow('Init failed')
    })
  })

  describe('handleLoadApp', () => {
    it('should load app successfully', async () => {
      const { loadApp } = await import('../models/app/index.js')
      vi.mocked(loadApp).mockResolvedValue(undefined)

      registerAppHandlers()
      const handler = vi.mocked(ipcMain.handle).mock.calls.find(
        ([channel]) => channel === CHANNELS.LOAD_APP
      )?.[1]

      await expect(handler?.()).resolves.not.toThrow()
      expect(loadApp).toHaveBeenCalled()
    })

    it('should throw error on failure', async () => {
      const { loadApp } = await import('../models/app/index.js')
      vi.mocked(loadApp).mockRejectedValue(new Error('Load failed'))

      registerAppHandlers()
      const handler = vi.mocked(ipcMain.handle).mock.calls.find(
        ([channel]) => channel === CHANNELS.LOAD_APP
      )?.[1]

      await expect(handler?.()).rejects.toThrow('Load failed')
    })
  })
})