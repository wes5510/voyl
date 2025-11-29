// TODO: db/node 모듈이 삭제되어 db 참조 함수들 임시 주석 처리
// import * as db from '../../db/node/index.js'
import * as NodeModel from '../node/index.js'
import { ROOT_NODE } from './const.js'

export async function initialize({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  await NodeModel.initialize({ workspaceDirPath })
  await NodeModel.addNode(ROOT_NODE)
}

export function getRootNodeId() {
  return ROOT_NODE.id
}

// export async function getNode({ nodeId }: { nodeId: string }): Promise<{
//   id: string
//   parentId?: string
//   childIds: string[]
//   title: string
//   content: string
// }> {
//   const node = await db.getNodeById({ id: nodeId })

//   if (!node) {
//     throw new Error(`Node with id ${nodeId} not found`)
//   }

//   const childIds = await db.getChildIds({ parentId: node.id })

//   return {
//     id: node.id,
//     parentId: node.parentId ?? undefined,
//     childIds,
//     title: node.title,
//     content: node.content,
//   }
// }

// export async function getChildNodeIds({
//   parentId,
// }: {
//   parentId: string
// }): Promise<string[]> {
//   if (parentId === '') {
//     throw new Error('Parent ID cannot be empty string')
//   }

//   const childIds = await db.getChildIds({ parentId })
//   return childIds
// }

// export async function getNodeIndex({
//   nodeId,
// }: {
//   nodeId: string
// }): Promise<string | undefined> {
//   if (nodeId === '') {
//     throw new Error('Node ID cannot be empty string')
//   }

//   const index = await db.getNodeIndexById({ id: nodeId })
//   return index
// }
