import { describe, it, expect, beforeEach, vi } from 'vitest'
import { isInitialized, initializeApp } from './index.js'
import * as AppRepo from '../../repo/app/index.js'

vi.mock('../../repo/app/index.js', () => ({
  exists: vi.fn(),
  create: vi.fn(),
}))

vi.mock('./workspace/index.js', () => ({
  initializeWorkspace: vi.fn().mockResolvedValue(undefined),
}))

describe('App Model', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })


  describe('isInitialized', () => {
    it('AppRepo.exists가 true를 반환하면 true를 반환해야 함', async () => {
      vi.mocked(AppRepo.exists).mockResolvedValue(true)

      const result = await isInitialized()

      expect(result).toBe(true)
      expect(AppRepo.exists).toHaveBeenCalled()
    })

    it('AppRepo.exists가 false를 반환하면 false를 반환해야 함', async () => {
      vi.mocked(AppRepo.exists).mockResolvedValue(false)

      const result = await isInitialized()

      expect(result).toBe(false)
      expect(AppRepo.exists).toHaveBeenCalled()
    })
  })


  describe('initializeApp', () => {
    it('워크스페이스 경로가 주어지면 앱을 초기화해야 함', async () => {
      const mockWorkspacePath = '/test/workspace'
      vi.mocked(AppRepo.create).mockResolvedValue(undefined)

      await initializeApp({ workspacePath: mockWorkspacePath })

      // AppRepo.create가 호출되었는지 확인
      expect(AppRepo.create).toHaveBeenCalledWith({
        workspacePath: mockWorkspacePath,
        version: '1.0.0',
      })

      // 워크스페이스 초기화가 호출되었는지 확인
      const { initializeWorkspace } = await import('./workspace/index.js')
      expect(initializeWorkspace).toHaveBeenCalledWith({ workspacePath: mockWorkspacePath })
    })
  })

})
