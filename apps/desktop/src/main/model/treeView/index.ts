import NodeRepo from '../../repo/node/index.js'

export type TreeViewItem = {
  nodeId: string
  depth: number
}

async function getTreeViewNodes({
  topNodeId,
  expandedNodeIds = [],
}: {
  topNodeId: string
  expandedNodeIds?: string[]
}): Promise<TreeViewItem[]> {
  const result: TreeViewItem[] = []

  // 재귀 함수로 트리 구조 생성
  async function buildTree(nodeId: string, depth: number) {
    if (topNodeId !== nodeId) {
      // 현재 노드 추가
      result.push({ nodeId, depth })
    }

    // 확장된 노드인 경우에만 자식 조회
    if (expandedNodeIds.includes(nodeId)) {
      const childIds = await NodeRepo.getChildIds({ parentId: nodeId })

      // 정렬된 순서로 재귀 호출
      for (const childId of childIds) {
        await buildTree(childId, depth + 1)
      }
    }
  }

  await buildTree(topNodeId, 0)
  return result
}

const TreeViewModel = {
  getTreeViewNodes,
}

export default TreeViewModel
