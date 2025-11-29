import * as TreeModel from '../model/tree/index.js'
import * as TreeViewModel from '../model/treeView/index.js'
import * as NodeModel from '../model/node/index.js'
import type { Node } from '../model/node/index.js'
import type { TreeViewItem } from '../model/treeView/index.js'

export const treeHandlers = {
  'tree.getRootNodeId': (): string => {
    return TreeModel.getRootNodeId()
  },

  'tree.getNode': async ({
    nodeId,
  }: {
    nodeId: string
  }): Promise<Node | null> => {
    return NodeModel.getNodeById({ id: nodeId })
  },

  'tree.getViewNodes': async ({
    topNodeId,
  }: {
    topNodeId: string
  }): Promise<TreeViewItem[]> => {
    // 하드코딩된 확장 상태 (프로토타이핑)
    const expandedNodeIds = [topNodeId, 'child-1', 'grandchild-1']
    return TreeViewModel.getTreeViewNodes({ topNodeId, expandedNodeIds })
  },

  'tree.updateNodeTitle': async ({
    nodeId,
    title,
  }: {
    nodeId: string
    title: string
  }): Promise<Node | null> => {
    return NodeModel.updateNodeTitle({ id: nodeId, title })
  },
}
