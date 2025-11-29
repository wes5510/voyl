import { logger } from '../../common/logger.util.js'
import * as NodeRepo from '../../repo/node/index.js'
import type { Node } from '../../repo/node/index.js'
import * as NodeModel from '../node/index.js'

export type TreeViewItem = {
  nodeId: string
  depth: number
}

export async function getTreeViewNodes({
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

export async function addNewNodeAfter({
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

export async function removeNode({ nodeId }: { nodeId: string }): Promise<Node> {
  logger.debug({ nodeId }, 'Remove Node')
  const node = await NodeModel.getNodeById({ id: nodeId })

  if (!node) {
    throw new Error('Node not found')
  }

  await NodeModel.removeChildIdFromParentNode({ id: nodeId })
  await NodeModel.removeChildNodes({ id: nodeId })
  await NodeModel.removeNode({ id: nodeId })

  return node
}
