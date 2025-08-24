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

    it('워크스페이스 초기화 시 필수 디렉터리가 모두 생성되어야 함', async () => {
      await initializeWorkspace({ workspacePath: testWorkspacePath })

      // 디렉터리 생성 확인
      expect(fs.ensureDir).toHaveBeenCalledWith(testWorkspacePath)
      expect(fs.ensureDir).toHaveBeenCalledWith(join(testWorkspacePath, 'nodes'))
      expect(fs.ensureDir).toHaveBeenCalledWith(join(testWorkspacePath, 'content'))
      expect(fs.ensureDir).toHaveBeenCalledWith(join(testWorkspacePath, 'log'))
    })

    it('워크스페이스 초기화 시 기본 settings.json 파일이 생성되어야 함', async () => {
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

    it('잘못된 경로가 주어지면 검증 에러가 발생해야 함', async () => {
      await expect(initializeWorkspace({ workspacePath: '' })).rejects.toThrow(
        'Workspace path cannot be empty'
      )

      await expect(initializeWorkspace({ workspacePath: 'relative/path' })).rejects.toThrow(
        'Workspace path must be absolute'
      )
    })

    it('초기화 중 실패하면 정리 작업이 수행되어야 함', async () => {
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
    it('경로 권한 확인 시 읽기/쓰기 권한이 있어야 함', async () => {
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

    it('경로에 권한이 부족하면 에러가 발생해야 함', async () => {
      vi.mocked(fs.ensureDir).mockResolvedValue(undefined)
      vi.mocked(fs.access).mockRejectedValue(new Error('Permission denied'))

      await expect(checkWorkspacePermissions({ workspacePath: testWorkspacePath })).rejects.toThrow(
        `Insufficient permissions for workspace: ${testWorkspacePath}`
      )
    })
  })
})