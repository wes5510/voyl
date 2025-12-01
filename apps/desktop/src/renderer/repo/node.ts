export const updateNodeTitle = ({ nodeId, title }: { nodeId: string; title: string }) => {
  return window.api['tree.updateNodeTitle']({ nodeId, title })
}

export const getPreviousFocusableNodeId = ({ id }: { id: string }): Promise<string | null> => {
  return window.api['node.getPreviousFocusableNodeId']({ id })
}
