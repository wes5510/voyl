export const fetchRootNodeId = (): Promise<string> => {
  return window.electron.ipcRenderer.invoke('/tree/root-node-id/get')
}

export interface NodeDTO {
  id: string
  parentId?: string
  childIds: string[]
  title: string
  content: string
}

export const fetchNode = async ({ nodeId }: { nodeId: string }): Promise<NodeDTO> => {
  const ret = await window.electron.ipcRenderer.invoke('/tree/node/get', { nodeId })
  return ret
}

export const updateNode = async ({ node }: { node: NodeDTO }): Promise<NodeDTO> => {
  /*
  const ret = await window.electron.ipcRenderer.invoke('/tree/node/update', { node })
  return ret
  */
  return Promise.resolve(node)
}
