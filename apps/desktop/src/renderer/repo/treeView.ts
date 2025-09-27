import { CHANNELS } from '@/common/channel.const'

export type TreeViewItem = {
  nodeId: string
  depth: number
}

export const fetchTreeViewNodes = async ({
  topNodeId,
}: {
  topNodeId: string
}): Promise<TreeViewItem[]> => {
  return window.electron.ipcRenderer.invoke(CHANNELS.GET_VIEW_TREE_NODES, { topNodeId })
}
