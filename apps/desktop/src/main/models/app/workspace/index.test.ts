import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs-extra'
import { 
  getWorkspacePath, 
  getWorkspaceSettingsPath, 
  getNodesPath,
  getContentPath,
  getLogPath
} from './index.js'

// Mock electron and fs-extra
vi.mock('electron', () => ({
  app: {
    getPath: vi.fn(() => '/mock/userData')
  }
}))

vi.mock('fs-extra')

describe('Workspace Model', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readJson).mockResolvedValue({
      workspacePath: '/test/workspace'
    })
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
})