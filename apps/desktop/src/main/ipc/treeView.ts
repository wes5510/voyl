import * as TreeViewModel from '../model/treeView/index.js'
import type { Node } from '../model/node/index.js'

export const treeViewHandlers = {
  'treeView.addNewNodeAfter': async ({
    nodeId,
    title,
  }: {
    nodeId: string
    title: string
  }): Promise<Node> => {
    return TreeViewModel.addNewNodeAfter({
      nodeId,
      title,
    })
  },

  'treeView.removeNode': async ({
    nodeId,
  }: {
    nodeId: string
  }): Promise<Node> => {
    return TreeViewModel.removeNode({ nodeId })
  },
}
