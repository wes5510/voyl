import NodeRepo, { type Node } from '../../repo/node/index.js'
import NodeModel from '../node/index.js'

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
      const childIds = await NodeRepo.getChildIds({ id: nodeId })

      // 정렬된 순서로 재귀 호출
      for (const childId of childIds) {
        await buildTree(childId, depth + 1)
      }
    }
  }

  await buildTree(topNodeId, 0)
  return result
}

async function addNewNodeAfter({
  nodeId,
  title,
}: {
  nodeId: string
  title: string
}): Promise<Node> {
  const isExist = await NodeModel.isExist({ id: nodeId })
  if (!isExist) {
    throw new Error('Source node not found')
  }

  const newNode = await NodeModel.addNode({
    title,
  })

  const expanded = false // await TreeViewRepo.isExpanded({ nodeId })

  return expanded
    ? prependChildNode({
        sourceId: nodeId,
        id: newNode.id,
      })
    : appendSiblingNode({
        sourceId: nodeId,
        id: newNode.id,
      })
}

async function appendSiblingNode({
  sourceId,
  id,
}: {
  sourceId: string
  id: string
}): Promise<Node> {
  const parentId = await NodeModel.getParentId({ id: sourceId })

  console.log({ sourceId, parentId })

  if (!parentId) {
    throw new Error('Parent node not found')
  }

  const index =
    (await NodeModel.getChildIndex({ id: parentId, childId: sourceId })) + 1

  return moveToChildNode({
    parentId,
    id,
    index,
  })
}

async function prependChildNode({
  sourceId,
  id,
}: {
  sourceId: string
  id: string
}): Promise<Node> {
  return moveToChildNode({
    parentId: sourceId,
    id,
    index: 0,
  })
}

async function moveToChildNode({
  parentId,
  id,
  index,
}: {
  parentId: string
  id: string
  index: number
}): Promise<Node> {
  const [, , newNode] = await Promise.all([
    NodeModel.removeChildIdFromParentNode({
      id,
    }),
    NodeModel.insertChildId({
      parentId,
      id,
      index,
    }),
    NodeModel.updateParentId({
      id,
      parentId,
    }),
  ])

  return newNode
}

const TreeViewModel = {
  getTreeViewNodes,
  addNewNodeAfter,
}

export default TreeViewModel
