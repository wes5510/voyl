import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs-extra'
import path from 'path'
import { 
  checkWorkspacePermissions,
  initializeWorkspace 
} from './index.js'

vi.mock('fs-extra', () => {
  const mockFs = {
    ensureDir: vi.fn(),
    access: vi.fn(),
    writeFile: vi.fn(),
    remove: vi.fn(),
    unlink: vi.fn(),
    pathExists: vi.fn(),
    writeJson: vi.fn(),
    readdir: vi.fn(),
    constants: {
      R_OK: 4,
      W_OK: 2
    }
  }
  return {
    default: mockFs,
    ...mockFs
  }
})
vi.mock('path')

describe('Workspace Model', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('checkWorkspacePermissions', () => {
    it('should pass when workspace has proper permissions', async () => {
      const workspacePath = '/test/workspace'
      vi.mocked(path.join).mockImplementation((...args) => args.join('/'))
      vi.mocked(fs.ensureDir).mockResolvedValue(undefined)
      vi.mocked(fs.access).mockResolvedValue(undefined)
      vi.mocked(fs.writeFile).mockResolvedValue(undefined)
      vi.mocked(fs.remove).mockResolvedValue(undefined)
      vi.mocked(fs.unlink).mockResolvedValue(undefined)
      
      await expect(checkWorkspacePermissions(workspacePath)).resolves.not.toThrow()
      
      expect(fs.ensureDir).toHaveBeenCalledWith(workspacePath)
      expect(fs.access).toHaveBeenCalledWith(
        workspacePath, 
        fs.constants.R_OK | fs.constants.W_OK
      )
      expect(fs.writeFile).toHaveBeenCalledWith(
        '/test/workspace/.test-write-permission',
        'test'
      )
      expect(fs.remove).toHaveBeenCalledWith('/test/workspace/.test-write-permission')
    })

    it('should throw error when workspace lacks permissions', async () => {
      const workspacePath = '/test/workspace'
      vi.mocked(fs.ensureDir).mockRejectedValue(new Error('Permission denied'))
      
      await expect(checkWorkspacePermissions(workspacePath)).rejects.toThrow(
        'Insufficient permissions for workspace: /test/workspace'
      )
    })

    it('should throw error when write test fails', async () => {
      const workspacePath = '/test/workspace'
      vi.mocked(fs.ensureDir).mockResolvedValue(undefined)
      vi.mocked(fs.access).mockResolvedValue(undefined)
      vi.mocked(fs.writeFile).mockRejectedValue(new Error('Write failed'))
      
      await expect(checkWorkspacePermissions(workspacePath)).rejects.toThrow(
        'Insufficient permissions for workspace: /test/workspace'
      )
    })
  })

  describe('initializeWorkspace', () => {
    it('should initialize workspace successfully', async () => {
      const workspacePath = '/test/workspace'
      vi.mocked(path.isAbsolute).mockReturnValue(true)
      vi.mocked(path.join).mockImplementation((...args) => args.join('/'))
      vi.mocked(fs.ensureDir).mockResolvedValue(undefined)
      vi.mocked(fs.access).mockResolvedValue(undefined)
      vi.mocked(fs.writeFile).mockResolvedValue(undefined)
      vi.mocked(fs.remove).mockResolvedValue(undefined)
      vi.mocked(fs.unlink).mockResolvedValue(undefined)
      vi.mocked(fs.pathExists).mockResolvedValue(false as any)
      vi.mocked(fs.writeJson).mockResolvedValue(undefined)
      
      await initializeWorkspace(workspacePath)
      
      // Check directories were created
      expect(fs.ensureDir).toHaveBeenCalledWith('/test/workspace/nodes')
      expect(fs.ensureDir).toHaveBeenCalledWith('/test/workspace/content')
      expect(fs.ensureDir).toHaveBeenCalledWith('/test/workspace/log')
      
      // Check settings file was created
      expect(fs.writeJson).toHaveBeenCalledWith(
        '/test/workspace/settings.json',
        expect.objectContaining({
          version: '1.0.0',
          createdAt: expect.any(String),
          nodeTypes: [],
          attributes: []
        }),
        { spaces: 2 }
      )
    })

    it('should validate workspace path is not empty', async () => {
      await expect(initializeWorkspace('')).rejects.toThrow(
        'Workspace path cannot be empty'
      )
    })

    it('should validate workspace path is absolute', async () => {
      vi.mocked(path.isAbsolute).mockReturnValue(false)
      
      await expect(initializeWorkspace('relative/path')).rejects.toThrow(
        'Workspace path must be absolute'
      )
    })

    it('should cleanup on initialization failure', async () => {
      const workspacePath = '/test/workspace'
      vi.mocked(path.isAbsolute).mockReturnValue(true)
      vi.mocked(path.join).mockImplementation((...args) => args.join('/'))
      vi.mocked(fs.ensureDir)
        .mockResolvedValueOnce(undefined) // workspace dir
        .mockRejectedValueOnce(new Error('Failed to create nodes dir')) // nodes dir fails
      vi.mocked(fs.access).mockResolvedValue(undefined)
      vi.mocked(fs.writeFile).mockResolvedValue(undefined)
      vi.mocked(fs.remove).mockResolvedValue(undefined)
      vi.mocked(fs.readdir).mockResolvedValue([] as any)
      
      await expect(initializeWorkspace(workspacePath)).rejects.toThrow()
      
      // Check cleanup was called - items are removed in parallel so order doesn't matter
      expect(fs.remove).toHaveBeenCalledWith('/test/workspace/settings.json')
      expect(fs.remove).toHaveBeenCalledWith('/test/workspace/nodes')
      expect(fs.remove).toHaveBeenCalledWith('/test/workspace/content')
      expect(fs.remove).toHaveBeenCalledWith('/test/workspace/log')
    })

    it('should not delete workspace if not empty after cleanup', async () => {
      const workspacePath = '/test/workspace'
      vi.mocked(path.isAbsolute).mockReturnValue(true)
      vi.mocked(path.join).mockImplementation((...args) => args.join('/'))
      vi.mocked(fs.ensureDir)
        .mockResolvedValueOnce(undefined) // workspace dir
        .mockRejectedValueOnce(new Error('Failed')) // nodes dir fails
      vi.mocked(fs.access).mockResolvedValue(undefined)
      vi.mocked(fs.writeFile).mockResolvedValue(undefined)
      vi.mocked(fs.remove).mockResolvedValue(undefined)
      vi.mocked(fs.readdir).mockResolvedValue(['existing-file.txt'] as any)
      
      await expect(initializeWorkspace(workspacePath)).rejects.toThrow()
      
      // Workspace should not be removed if it has files
      expect(fs.remove).not.toHaveBeenCalledWith(workspacePath)
    })

    it('should skip settings creation if already exists', async () => {
      const workspacePath = '/test/workspace'
      vi.mocked(path.isAbsolute).mockReturnValue(true)
      vi.mocked(path.join).mockImplementation((...args) => args.join('/'))
      vi.mocked(fs.ensureDir).mockResolvedValue(undefined)
      vi.mocked(fs.access).mockResolvedValue(undefined)
      vi.mocked(fs.writeFile).mockResolvedValue(undefined)
      vi.mocked(fs.remove).mockResolvedValue(undefined)
      vi.mocked(fs.pathExists).mockResolvedValue(true as any) // settings already exists
      vi.mocked(fs.unlink).mockResolvedValue(undefined) // for test file removal in checkWorkspacePermissions
      
      await initializeWorkspace(workspacePath)
      
      // Settings file should not be written if it already exists
      expect(fs.writeJson).not.toHaveBeenCalled()
    })
  })
})