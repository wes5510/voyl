import TreeModel from '../tree/index.js'

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
    // 모든 노드의 index를 조회 (정렬을 위해)
    await TreeModel.getNodeIndex({ nodeId })

    // 현재 노드 추가
    result.push({ nodeId, depth })

    // 확장된 노드인 경우에만 자식 조회
    if (expandedNodeIds.includes(nodeId)) {
      const childIds = await TreeModel.getChildNodeIds({ parentId: nodeId })

      // 자식 노드들의 index를 가져와서 정렬
      const childrenWithIndex = await Promise.all(
        childIds.map(async (childId) => {
          const index = await TreeModel.getNodeIndex({ nodeId: childId })
          return { nodeId: childId, index: index || 'zzz' } // undefined는 정렬상 마지막으로
        }),
      )

      // index로 사전적 정렬
      childrenWithIndex.sort((a, b) => a.index.localeCompare(b.index))

      // 정렬된 순서로 재귀 호출
      for (const child of childrenWithIndex) {
        await buildTree(child.nodeId, depth + 1)
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
