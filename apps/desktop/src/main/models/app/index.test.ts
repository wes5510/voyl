import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs-extra'
import { app } from 'electron'
import { 
  getConfigPath, 
  getCachePath, 
  isInitialized, 
  loadAppConfig,
  initializeApp,
  loadApp
} from './index.js'

vi.mock('electron', () => ({
  app: {
    getPath: vi.fn((name: string) => {
      if (name === 'userData') return '/mock/userData'
      if (name === 'cache') return '/mock/cache'
      return '/mock/path'
    }),
    getAppPath: vi.fn(() => '/mock/app')
  }
}))

vi.mock('fs-extra')
vi.mock('./workspace/index.js', () => ({
  initializeWorkspace: vi.fn()
}))
vi.mock('../../db/index.js', () => ({
  initialize: vi.fn()
}))

describe('App Model', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
    it('should load config when file exists', async () => {
      const mockConfig = { workspacePath: '/test/workspace' }
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readJson).mockResolvedValue(mockConfig as any)
      
      const config = await loadAppConfig()
      
      expect(config).toEqual(mockConfig)
      expect(fs.readJson).toHaveBeenCalledWith('/mock/userData/config.json')
    })

    it('should throw error when config file does not exist', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)
      
      await expect(loadAppConfig()).rejects.toThrow(
        'App configuration not found. Initialization required.'
      )
    })

    it('should throw error when workspacePath is missing', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readJson).mockResolvedValue({} as any)
      
      await expect(loadAppConfig()).rejects.toThrow(
        'Workspace path not configured.'
      )
    })
  })

  describe('initializeApp', () => {
    it('should save config and initialize workspace', async () => {
      const workspacePath = '/test/workspace'
      const { initializeWorkspace } = await import('./workspace/index.js')
      
      await initializeApp(workspacePath)
      
      expect(fs.writeJson).toHaveBeenCalledWith(
        '/mock/userData/config.json',
        { workspacePath },
        { spaces: 2 }
      )
      expect(initializeWorkspace).toHaveBeenCalledWith(workspacePath)
    })
  })

  describe('loadApp', () => {
    it('should load config and initialize database', async () => {
      const mockConfig = { workspacePath: '/test/workspace' }
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readJson).mockResolvedValue(mockConfig as any)
      const { initialize } = await import('../../db/index.js')
      
      await loadApp()
      
      expect(fs.readJson).toHaveBeenCalledWith('/mock/userData/config.json')
      expect(fs.existsSync).toHaveBeenCalledWith('/test/workspace')
      expect(initialize).toHaveBeenCalledWith('/mock/userData/cache.db')
    })

    it('should throw error when workspace path not configured', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readJson).mockResolvedValue({ workspacePath: '' } as any)
      
      await expect(loadApp()).rejects.toThrow('Workspace path not configured')
    })

    it('should throw error when workspace directory does not exist', async () => {
      vi.mocked(fs.existsSync)
        .mockReturnValueOnce(true) // config exists
        .mockReturnValueOnce(false) // workspace doesn't exist
      vi.mocked(fs.readJson).mockResolvedValue({ workspacePath: '/test/workspace' } as any)
      
      await expect(loadApp()).rejects.toThrow('Workspace not found: /test/workspace')
    })
  })
})