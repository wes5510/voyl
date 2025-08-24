import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { tmpdir } from 'os'
import { join } from 'path'
import fs from 'fs-extra'
import { 
  getWorkspacePath, 
  getWorkspaceSettingsPath, 
  getNodesPath,
  getContentPath,
  getLogPath,
  initializeWorkspace,
  checkWorkspacePermissions
} from './index.js'

// Mock electron and fs-extra
vi.mock('electron', () => ({
  app: {
    getPath: vi.fn(() => '/mock/userData')
  }
}))

vi.mock('fs-extra')

describe('Workspace Model', () => {
  const testWorkspacePath = join(tmpdir(), 'test-workspace-' + Date.now())

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readJson).mockResolvedValue({
      workspacePath: '/test/workspace'
    })
  })

  afterEach(() => {
    // Mock cleanup
    vi.clearAllMocks()
  })

  describe('getWorkspacePath', () => {
    it('should return workspace path from app config', async () => {
      const path = await getWorkspacePath()
      expect(path).toBe('/test/workspace')
      expect(fs.readJson).toHaveBeenCalledWith('/mock/userData/config.json')
    })
  })

  describe('getWorkspaceSettingsPath', () => {
    it('should return correct settings path', async () => {
      const path = await getWorkspaceSettingsPath()
      expect(path).toBe('/test/workspace/settings.json')
    })
  })

  describe('getNodesPath', () => {
    it('should return correct nodes path', async () => {
      const path = await getNodesPath()
      expect(path).toBe('/test/workspace/nodes')
    })
  })

  describe('getContentPath', () => {
    it('should return correct content path', async () => {
      const path = await getContentPath()
      expect(path).toBe('/test/workspace/content')
    })
  })

  describe('getLogPath', () => {
    it('should return correct log path', async () => {
      const path = await getLogPath()
      expect(path).toBe('/test/workspace/log')
    })
  })

  describe('initializeWorkspace', () => {
    beforeEach(() => {
      vi.mocked(fs.ensureDir).mockResolvedValue(undefined)
      vi.mocked(fs.access).mockResolvedValue(undefined)
      vi.mocked(fs.writeFile).mockResolvedValue(undefined)
      vi.mocked(fs.remove).mockResolvedValue(undefined)
      vi.mocked(fs.pathExists).mockResolvedValue(false)
      vi.mocked(fs.writeJson).mockResolvedValue(undefined)
    })

    it('should create all required directories', async () => {
      await initializeWorkspace({ workspacePath: testWorkspacePath })

      // 디렉터리 생성 확인
      expect(fs.ensureDir).toHaveBeenCalledWith(testWorkspacePath)
      expect(fs.ensureDir).toHaveBeenCalledWith(join(testWorkspacePath, 'nodes'))
      expect(fs.ensureDir).toHaveBeenCalledWith(join(testWorkspacePath, 'content'))
      expect(fs.ensureDir).toHaveBeenCalledWith(join(testWorkspacePath, 'log'))
    })

    it('should create settings.json with default values', async () => {
      await initializeWorkspace({ workspacePath: testWorkspacePath })

      expect(fs.writeJson).toHaveBeenCalledWith(
        join(testWorkspacePath, 'settings.json'),
        expect.objectContaining({
          version: '1.0.0',
          createdAt: expect.any(String),
          nodeTypes: [],
          attributes: []
        }),
        { spaces: 2 }
      )
    })

    it('should validate workspace path', async () => {
      await expect(initializeWorkspace({ workspacePath: '' })).rejects.toThrow(
        'Workspace path cannot be empty'
      )

      await expect(initializeWorkspace({ workspacePath: 'relative/path' })).rejects.toThrow(
        'Workspace path must be absolute'
      )
    })

    it('should cleanup on failure', async () => {
      // Mock ensureDir to fail on second call
      vi.mocked(fs.ensureDir)
        .mockResolvedValueOnce(undefined) // workspace dir succeeds
        .mockRejectedValueOnce(new Error('Permission denied')) // nodes dir fails

      await expect(initializeWorkspace({ workspacePath: testWorkspacePath })).rejects.toThrow()

      // Verify cleanup was attempted
      expect(fs.remove).toHaveBeenCalled()
    })
  })

  describe('checkWorkspacePermissions', () => {
    it('should check read/write permissions', async () => {
      vi.mocked(fs.ensureDir).mockResolvedValue(undefined)
      vi.mocked(fs.access).mockResolvedValue(undefined)
      vi.mocked(fs.writeFile).mockResolvedValue(undefined)
      vi.mocked(fs.remove).mockResolvedValue(undefined)

      await checkWorkspacePermissions({ workspacePath: testWorkspacePath })

      expect(fs.access).toHaveBeenCalledWith(
        testWorkspacePath,
        fs.constants.R_OK | fs.constants.W_OK
      )
    })

    it('should throw on insufficient permissions', async () => {
      vi.mocked(fs.ensureDir).mockResolvedValue(undefined)
      vi.mocked(fs.access).mockRejectedValue(new Error('Permission denied'))

      await expect(checkWorkspacePermissions({ workspacePath: testWorkspacePath })).rejects.toThrow(
        `Insufficient permissions for workspace: ${testWorkspacePath}`
      )
    })
  })
})