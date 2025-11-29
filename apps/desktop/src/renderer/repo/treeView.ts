import { NodeDTO } from './tree'

export type TreeViewItem = {
  nodeId: string
  depth: number
}

export const fetchTreeViewNodes = async ({
  topNodeId,
}: {
  topNodeId: string
}): Promise<TreeViewItem[]> => {
  return window.api['tree.getViewNodes']({ topNodeId })
}

export const addNewNodeAfter = async ({
  nodeId,
  title,
}: {
  nodeId: string
  title: string
}): Promise<NodeDTO> => {
  return window.api['treeView.addNewNodeAfter']({
    nodeId,
    title,
  })
}

export const removeNode = async ({
  nodeId,
}: {
  nodeId: string
}): Promise<NodeDTO> => {
  return window.api['treeView.removeNode']({
    nodeId,
  })
}
