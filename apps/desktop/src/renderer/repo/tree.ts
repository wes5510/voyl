export const fetchRootNodeId = (): Promise<string> => {
  return window.api['tree.getRootNodeId']()
}

export interface NodeDTO {
  id: string
  parentId: string | null
  childIds: string[]
  title: string
  content: string
}

export const fetchNode = async ({
  nodeId,
}: {
  nodeId: string
}): Promise<NodeDTO | null> => {
  const ret = await window.api['tree.getNode']({ nodeId })
  return ret
}

export const updateNode = async ({
  node,
}: {
  node: NodeDTO
}): Promise<NodeDTO> => {
  /*
  const ret = await window.electron.ipcRenderer.invoke('/tree/node/update', { node })
  return ret
  */
  return Promise.resolve(node)
}
