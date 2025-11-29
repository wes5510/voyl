import { CHANNELS } from '@/common/channel.const'
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
  return window.electron.ipcRenderer.invoke(CHANNELS.GET_VIEW_TREE_NODES, {
    topNodeId,
  })
}

export const addNewNodeAfter = async ({
  nodeId,
  title,
}: {
  nodeId: string
  title: string
}): Promise<NodeDTO> => {
  return window.api.addNewNodeAfter({
    nodeId,
    title,
  })
}

export const removeNode = async ({
  nodeId,
}: {
  nodeId: string
}): Promise<NodeDTO> => {
  return window.api.removeNode({
    nodeId,
  })
}
