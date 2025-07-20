import { CHANNELS } from '@/common/channel.const'

export const fetchRootNodeId = (): Promise<string> => {
  return window.electron.ipcRenderer.invoke(CHANNELS.GET_ROOT_NODE_ID)
}

export interface NodeDTO {
  id: string
  parentId?: string
  childIds: string[]
  title: string
  content: string
}

export const fetchNode = async ({ nodeId }: { nodeId: string }): Promise<NodeDTO> => {
  const ret = await window.electron.ipcRenderer.invoke(CHANNELS.GET_NODE, { nodeId })
  return ret
}

export const updateNode = async ({ node }: { node: NodeDTO }): Promise<NodeDTO> => {
  /*
  const ret = await window.electron.ipcRenderer.invoke('/tree/node/update', { node })
  return ret
  */
  return Promise.resolve(node)
}
