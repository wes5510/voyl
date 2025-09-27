import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTreeViewNodes } from './index.js'

// Mock tree core model
vi.mock('../tree/index.js', () => ({
  getChildNodeIds: vi.fn(),
  getNodeIndex: vi.fn(),
}))

// eslint-disable-next-line voyl/same-level-import
import { getChildNodeIds, getNodeIndex } from '../tree/index.js'

const mockGetChildNodeIds = vi.mocked(getChildNodeIds)
const mockGetNodeIndex = vi.mocked(getNodeIndex)

describe('getTreeViewNodes', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('단순한 1레벨 트리 - 자식 없음', async () => {
    // Arrange
    const topNodeId = 'node-1'
    const expandedNodeIds = ['node-1']

    mockGetChildNodeIds.mockResolvedValueOnce([]) // node-1의 자식 없음
    mockGetNodeIndex.mockResolvedValueOnce('a') // node-1의 index

    // Act
    const result = await getTreeViewNodes({ topNodeId, expandedNodeIds })

    // Assert
    expect(result).toEqual([{ nodeId: 'node-1', depth: 0 }])
    expect(mockGetChildNodeIds).toHaveBeenCalledWith({ parentId: 'node-1' })
    expect(mockGetNodeIndex).toHaveBeenCalledWith({ nodeId: 'node-1' })
  })

  it('단순한 1레벨 트리 - 확장된 노드에 자식 있음', async () => {
    // Arrange
    const topNodeId = 'node-1'
    const expandedNodeIds = ['node-1']

    mockGetChildNodeIds
      .mockResolvedValueOnce(['child-1', 'child-2']) // node-1의 자식
      .mockResolvedValueOnce([]) // child-1의 자식 없음
      .mockResolvedValueOnce([]) // child-2의 자식 없음

    mockGetNodeIndex
      .mockResolvedValueOnce('a') // node-1의 index
      .mockResolvedValueOnce('b') // child-1의 index
      .mockResolvedValueOnce('a') // child-2의 index

    // Act
    const result = await getTreeViewNodes({ topNodeId, expandedNodeIds })

    // Assert
    expect(result).toEqual([
      { nodeId: 'node-1', depth: 0 },
      { nodeId: 'child-2', depth: 1 }, // index 'a' - 먼저
      { nodeId: 'child-1', depth: 1 }, // index 'b' - 나중
    ])
  })

  it('깊은 트리 구조 - 중간 축소', async () => {
    // Arrange
    const topNodeId = 'root'
    const expandedNodeIds = ['root', 'child-1'] // child-2는 축소됨

    // Mock 구체적 설정
    mockGetChildNodeIds.mockImplementation((args) => {
      if (args.parentId === 'root') return Promise.resolve(['child-1', 'child-2'])
      if (args.parentId === 'child-1') return Promise.resolve(['grandchild-1'])
      if (args.parentId === 'grandchild-1') return Promise.resolve([])
      return Promise.resolve([])
    })

    mockGetNodeIndex.mockImplementation((args) => {
      if (args.nodeId === 'root') return Promise.resolve('a')
      if (args.nodeId === 'child-1') return Promise.resolve('a')
      if (args.nodeId === 'child-2') return Promise.resolve('b')
      if (args.nodeId === 'grandchild-1') return Promise.resolve('a')
      return Promise.resolve(undefined)
    })

    // Act
    const result = await getTreeViewNodes({ topNodeId, expandedNodeIds })

    // Assert
    expect(result).toEqual([
      { nodeId: 'root', depth: 0 },
      { nodeId: 'child-1', depth: 1 }, // 확장됨
      { nodeId: 'grandchild-1', depth: 2 }, // child-1의 자식
      { nodeId: 'child-2', depth: 1 }, // 축소됨 (자식 조회 안함)
    ])
  })

  it('index 필드 정렬 - 사전적 순서', async () => {
    // Arrange
    const topNodeId = 'parent'
    const expandedNodeIds = ['parent']

    mockGetChildNodeIds.mockImplementation((args) => {
      if (args.parentId === 'parent') return Promise.resolve(['node-d', 'node-a', 'node-c'])
      return Promise.resolve([])
    })

    mockGetNodeIndex.mockImplementation((args) => {
      if (args.nodeId === 'parent') return Promise.resolve('z')
      if (args.nodeId === 'node-d') return Promise.resolve('d')
      if (args.nodeId === 'node-a') return Promise.resolve('a')
      if (args.nodeId === 'node-c') return Promise.resolve('c')
      return Promise.resolve(undefined)
    })

    // Act
    const result = await getTreeViewNodes({ topNodeId, expandedNodeIds })

    // Assert
    expect(result).toEqual([
      { nodeId: 'parent', depth: 0 },
      { nodeId: 'node-a', depth: 1 }, // index 'a' - 첫째
      { nodeId: 'node-c', depth: 1 }, // index 'c' - 둘째
      { nodeId: 'node-d', depth: 1 }, // index 'd' - 셋째
    ])
  })

  it('index 필드 누락 처리', async () => {
    // Arrange
    const topNodeId = 'parent'
    const expandedNodeIds = ['parent']

    mockGetChildNodeIds.mockResolvedValueOnce(['child-1', 'child-2'])

    mockGetNodeIndex
      .mockResolvedValueOnce('a') // parent의 index
      .mockResolvedValueOnce(undefined) // child-1의 index 누락
      .mockResolvedValueOnce('b') // child-2의 index

    // Act
    const result = await getTreeViewNodes({ topNodeId, expandedNodeIds })

    // Assert
    expect(result).toEqual([
      { nodeId: 'parent', depth: 0 },
      { nodeId: 'child-2', depth: 1 }, // index 'b' - 먼저
      { nodeId: 'child-1', depth: 1 }, // index undefined -> 'zzz' - 나중
    ])
  })
})
