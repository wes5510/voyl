export const updateNodeTitle = ({ nodeId, title }: { nodeId: string; title: string }) => {
  return window.api['tree.updateNodeTitle']({ nodeId, title })
}
