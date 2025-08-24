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
    it('올바른 config 경로를 반환해야 함', () => {
      const path = getConfigPath()
      expect(path).toBe('/mock/userData/config.json')
      expect(app.getPath).toHaveBeenCalledWith('userData')
    })
  })

  describe('getCachePath', () => {
    it('올바른 cache 경로를 반환해야 함', () => {
      const path = getCachePath()
      expect(path).toBe('/mock/userData/cache.db')
      expect(app.getPath).toHaveBeenCalledWith('userData')
    })
  })

  describe('isInitialized', () => {
    it('config가 존재하면 true를 반환해야 함', async () => {
      vi.mocked(fs.pathExists).mockImplementation(() => Promise.resolve(true))

      const result = await isInitialized()

      expect(result).toBe(true)
      expect(fs.pathExists).toHaveBeenCalledWith('/mock/userData/config.json')
    })

    it('config가 존재하지 않으면 false를 반환해야 함', async () => {
      vi.mocked(fs.pathExists).mockImplementation(() => Promise.resolve(false))

      const result = await isInitialized()

      expect(result).toBe(false)
    })
  })

  describe('loadAppConfig', () => {
    it('파일이 존재할 때 config를 로드해야 함', async () => {
      const mockConfig = { workspacePath: '/test/workspace' }
      vi.mocked(fs.pathExists).mockImplementation(() => Promise.resolve(true))
      vi.mocked(fs.readJson).mockResolvedValue(mockConfig)

      const config = await loadAppConfig()

      expect(config).toEqual(mockConfig)
      expect(fs.readJson).toHaveBeenCalledWith('/mock/userData/config.json')
    })

    it('config 파일이 존재하지 않을 때 에러를 발생시켜야 함', async () => {
      vi.mocked(fs.pathExists).mockImplementation(() => Promise.resolve(false))

      await expect(loadAppConfig()).rejects.toThrow(
        'App configuration not found. Initialization required.',
      )
    })

    it('workspacePath가 누락됐을 때 에러를 발생시켜야 함', async () => {
      vi.mocked(fs.pathExists).mockImplementation(() => Promise.resolve(true))
      vi.mocked(fs.readJson).mockResolvedValue({})

      await expect(loadAppConfig()).rejects.toThrow('Workspace path not configured.')
    })
  })
})
