import { describe, it, expect, beforeEach, vi } from 'vitest'
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
  initializeWorkspace: vi.fn().mockResolvedValue(undefined),
}))

describe('App Model', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setAppConfig(null)
  })

  describe('getConfigPath', () => {
    it('config 경로를 요청하면 userData 경로를 반환해야 함', () => {
      const path = getConfigPath()
      expect(path).toBe('/mock/userData/config.json')
      expect(app.getPath).toHaveBeenCalledWith('userData')
    })
  })

  describe('getCachePath', () => {
    it('cache 경로를 요청하면 userData 경로를 반환해야 함', () => {
      const path = getCachePath()
      expect(path).toBe('/mock/userData/cache.db')
      expect(app.getPath).toHaveBeenCalledWith('userData')
    })
  })

  describe('isInitialized', () => {
    it('config 파일이 존재하면 true를 반환해야 함', async () => {
      vi.mocked(fs.pathExists).mockImplementation(() => Promise.resolve(true))

      const result = await isInitialized()

      expect(result).toBe(true)
      expect(fs.pathExists).toHaveBeenCalledWith('/mock/userData/config.json')
    })

    it('config 파일이 존재하지 않으면 false를 반환해야 함', async () => {
      vi.mocked(fs.pathExists).mockImplementation(() => Promise.resolve(false))

      const result = await isInitialized()

      expect(result).toBe(false)
    })
  })

  describe('loadAppConfig', () => {
    it('config 파일이 존재하면 로드하여 반환해야 함', async () => {
      const mockConfig = { workspacePath: '/test/workspace' }
      vi.mocked(fs.pathExists).mockImplementation(() => Promise.resolve(true))
      vi.mocked(fs.readJson).mockResolvedValue(mockConfig)

      const config = await loadAppConfig()

      expect(config).toEqual(mockConfig)
      expect(fs.readJson).toHaveBeenCalledWith('/mock/userData/config.json')
      expect(getAppConfig()).toEqual(mockConfig)
    })

    it('config 파일이 존재하지 않으면 에러를 발생시켜야 함', async () => {
      vi.mocked(fs.pathExists).mockImplementation(() => Promise.resolve(false))

      await expect(loadAppConfig()).rejects.toThrow(
        'App configuration not found. Initialization required.',
      )
    })

    it('workspacePath가 누락되면 에러를 발생시켜야 함', async () => {
      vi.mocked(fs.pathExists).mockImplementation(() => Promise.resolve(true))
      vi.mocked(fs.readJson).mockResolvedValue({})

      await expect(loadAppConfig()).rejects.toThrow('Workspace path not configured.')
    })
  })

  describe('initializeApp', () => {
    it('워크스페이스 경로가 주어지면 앱을 초기화해야 함', async () => {
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
        { spaces: 2 },
      )

      // 워크스페이스 초기화가 호출되었는지 확인
      const { initializeWorkspace } = await import('./workspace/index.js')
      expect(initializeWorkspace).toHaveBeenCalledWith({ workspacePath: mockWorkspacePath })
    })
  })

  describe('memory management', () => {
    it('config 설정과 조회 시 메모리에서 관리되어야 함', () => {
      expect(getAppConfig()).toBeNull()

      const testConfig = { workspacePath: '/test/path' }
      setAppConfig(testConfig)

      expect(getAppConfig()).toEqual(testConfig)
    })
  })
})
