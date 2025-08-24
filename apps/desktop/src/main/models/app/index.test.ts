import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { tmpdir } from 'os'
import { join } from 'path'
import fs from 'fs-extra'
import { app } from 'electron'
import { 
  getConfigPath, 
  getCachePath, 
  isInitialized, 
  loadAppConfig,
  getAppConfig,
  setAppConfig,
  initializeApp,
  loadApp
} from './index.js'

// Electron app mock
vi.mock('electron', () => ({
  app: {
    getPath: vi.fn((key) => {
      if (key === 'userData') return '/mock/userData'
      if (key === 'cache') return '/mock/cache'
      return '/mock/path'
    }),
  },
}))

vi.mock('fs-extra')
vi.mock('./workspace/index.js', () => ({
  initializeWorkspace: vi.fn().mockResolvedValue(undefined)
}))

describe('App Model', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setAppConfig(null)
  })

  describe('getConfigPath', () => {
    it('should return correct config path', () => {
      const path = getConfigPath()
      expect(path).toBe('/mock/userData/config.json')
      expect(app.getPath).toHaveBeenCalledWith('userData')
    })
  })

  describe('getCachePath', () => {
    it('should return correct cache path', () => {
      const path = getCachePath()
      expect(path).toBe('/mock/userData/cache.db')
      expect(app.getPath).toHaveBeenCalledWith('userData')
    })
  })

  describe('isInitialized', () => {
    it('should return true when config exists', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)

      const result = await isInitialized()

      expect(result).toBe(true)
      expect(fs.existsSync).toHaveBeenCalledWith('/mock/userData/config.json')
    })

    it('should return false when config does not exist', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)

      const result = await isInitialized()

      expect(result).toBe(false)
    })
  })

  describe('loadAppConfig', () => {
    it('should load config when file exists and store in memory', async () => {
      const mockConfig = { workspacePath: '/test/workspace' }
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readJson).mockResolvedValue(mockConfig)

      const config = await loadAppConfig()

      expect(config).toEqual(mockConfig)
      expect(fs.readJson).toHaveBeenCalledWith('/mock/userData/config.json')
      expect(getAppConfig()).toEqual(mockConfig)
    })

    it('should throw error when config file does not exist', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)

      await expect(loadAppConfig()).rejects.toThrow(
        'App configuration not found. Initialization required.',
      )
    })

    it('should throw error when workspacePath is missing', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readJson).mockResolvedValue({})

      await expect(loadAppConfig()).rejects.toThrow('Workspace path not configured.')
    })
  })

  describe('initializeApp', () => {
    it('should initialize app with workspace path', async () => {
      const mockWorkspacePath = '/test/workspace'
      vi.mocked(fs.writeJson).mockResolvedValue(undefined)

      await initializeApp({ workspacePath: mockWorkspacePath })

      // 설정 파일이 저장되었는지 확인
      expect(fs.writeJson).toHaveBeenCalledWith(
        '/mock/userData/config.json',
        expect.objectContaining({
          version: '1.0.0',
          workspacePath: mockWorkspacePath,
          createdAt: expect.any(String),
          lastUsed: expect.any(String),
        }),
        { spaces: 2 }
      )

      // 워크스페이스 초기화가 호출되었는지 확인
      const { initializeWorkspace } = await import('./workspace/index.js')
      expect(initializeWorkspace).toHaveBeenCalledWith({ workspacePath: mockWorkspacePath })
    })
  })

  describe('memory management', () => {
    it('should manage app config in memory', () => {
      expect(getAppConfig()).toBeNull()
      
      const testConfig = { workspacePath: '/test/path' }
      setAppConfig(testConfig)
      
      expect(getAppConfig()).toEqual(testConfig)
    })
  })
})
