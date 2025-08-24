import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { tmpdir } from 'os'
import { join } from 'path'
import fs from 'fs-extra'
import { 
  initializeWorkspace,
  checkWorkspacePermissions
} from './index.js'

// Mock fs-extra
vi.mock('fs-extra')

describe('Workspace Model', () => {
  const testWorkspacePath = join(tmpdir(), 'test-workspace-' + Date.now())

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Mock cleanup
    vi.clearAllMocks()
  })

  describe('initializeWorkspace', () => {
    beforeEach(() => {
      vi.mocked(fs.ensureDir).mockResolvedValue(undefined)
      vi.mocked(fs.access).mockResolvedValue(undefined)
      vi.mocked(fs.writeFile).mockResolvedValue(undefined)
      vi.mocked(fs.remove).mockResolvedValue(undefined)
      vi.mocked(fs.pathExists).mockImplementation(() => Promise.resolve(false))
      vi.mocked(fs.writeJson).mockResolvedValue(undefined)
    })

    it('필수 디렉터리를 모두 생성해야 함', async () => {
      await initializeWorkspace({ workspacePath: testWorkspacePath })

      // 디렉터리 생성 확인
      expect(fs.ensureDir).toHaveBeenCalledWith(testWorkspacePath)
      expect(fs.ensureDir).toHaveBeenCalledWith(join(testWorkspacePath, 'nodes'))
      expect(fs.ensureDir).toHaveBeenCalledWith(join(testWorkspacePath, 'content'))
      expect(fs.ensureDir).toHaveBeenCalledWith(join(testWorkspacePath, 'log'))
    })

    it('기본값을 포함한 settings.json 파일을 생성해야 함', async () => {
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

    it('워크스페이스 경로를 검증해야 함', async () => {
      await expect(initializeWorkspace({ workspacePath: '' })).rejects.toThrow(
        'Workspace path cannot be empty'
      )

      await expect(initializeWorkspace({ workspacePath: 'relative/path' })).rejects.toThrow(
        'Workspace path must be absolute'
      )
    })

    it('실패 시 정리 작업을 수행해야 함', async () => {
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
    it('읽기/쓰기 권한을 확인해야 함', async () => {
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

    it('권한이 부족할 때 에러를 발생시켜야 함', async () => {
      vi.mocked(fs.ensureDir).mockResolvedValue(undefined)
      vi.mocked(fs.access).mockRejectedValue(new Error('Permission denied'))

      await expect(checkWorkspacePermissions({ workspacePath: testWorkspacePath })).rejects.toThrow(
        `Insufficient permissions for workspace: ${testWorkspacePath}`
      )
    })
  })
})