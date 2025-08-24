import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs-extra'
import { app } from 'electron'
import { getConfigPath, getCachePath, isInitialized, loadAppConfig } from './index.js'

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
      vi.mocked(fs.readJson).mockResolvedValue(mockConfig)

      const config = await loadAppConfig()

      expect(config).toEqual(mockConfig)
      expect(fs.readJson).toHaveBeenCalledWith('/mock/userData/config.json')
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
})
