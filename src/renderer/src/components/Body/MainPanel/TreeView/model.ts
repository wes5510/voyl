export interface TreeModel {
  nodeIds: string[]
}

export const insertAfter = ({
  nodeIds,
  sourceNodeId,
  newNodeId
}: {
  nodeIds: string[]
  sourceNodeId: string
  newNodeId: string
}): string[] => {
  const __new = [...nodeIds]
  const srcIdx = __new.indexOf(sourceNodeId)

  if (srcIdx >= 0) {
    __new.splice(srcIdx + 1, 0, newNodeId)
  }

  return __new
}
