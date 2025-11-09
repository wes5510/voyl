import { describe, it, expect, beforeEach, vi } from 'vitest'
import AppModel from './index.js'
import AppRepo from '../../repo/app/index.js'
import SyncMetadataRepo from '../../repo/syncMetadata/index.js'
import WorkspaceModel from './workspace/index.js'
// eslint-disable-next-line voyl/same-level-import
import NodeModel from '../node/index.js'

vi.mock('../../repo/app/index.js', () => ({
  default: {
    exists: vi.fn(),
    initialize: vi.fn(),
    sync: vi.fn(),
    getWorkspaceDirPath: vi.fn(),
  },
}))

vi.mock('../../repo/syncMetadata/index.js', () => ({
  default: {
    initialize: vi.fn(),
    get: vi.fn(),
    add: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    sync: vi.fn(),
  },
}))

vi.mock('./workspace/index.js', () => ({
  default: {
    initialize: vi.fn(),
    sync: vi.fn(),
  },
}))

vi.mock('../node/index.js', () => ({
  default: {
    initialize: vi.fn(),
    sync: vi.fn(),
  },
}))

describe('App Model', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('isInitialized', () => {
    it('AppRepo.exists가 true를 반환하면 true를 반환해야 함', async () => {
      vi.mocked(AppRepo.exists).mockResolvedValue(true)

      const result = await AppModel.isInitialized()

      expect(result).toBe(true)
      expect(AppRepo.exists).toHaveBeenCalled()
    })

    it('AppRepo.exists가 false를 반환하면 false를 반환해야 함', async () => {
      vi.mocked(AppRepo.exists).mockResolvedValue(false)

      const result = await AppModel.isInitialized()

      expect(result).toBe(false)
      expect(AppRepo.exists).toHaveBeenCalled()
    })
  })

  describe('initializeApp', () => {
    it('워크스페이스 경로가 주어지면 앱을 초기화해야 함', async () => {
      const mockWorkspaceDirPath = '/test/workspace'
      vi.mocked(AppRepo.initialize).mockResolvedValue(undefined)

      await AppModel.initializeApp({ workspaceDirPath: mockWorkspaceDirPath })

      expect(SyncMetadataRepo.initialize).toHaveBeenCalled()
      expect(AppRepo.initialize).toHaveBeenCalledWith({
        workspaceDirPath: mockWorkspaceDirPath,
        version: '1.0.0',
      })
      expect(WorkspaceModel.initialize).toHaveBeenCalledWith({
        workspaceDirPath: mockWorkspaceDirPath,
      })
      expect(NodeModel.initialize).toHaveBeenCalledWith({
        workspaceDirPath: mockWorkspaceDirPath,
      })
    })
  })
})
