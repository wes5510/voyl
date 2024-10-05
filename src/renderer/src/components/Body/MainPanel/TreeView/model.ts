export interface TreeModel {
  nodeIds: string[]
}

export const insertAfter = ({
  nodeIds,
  sourceNodeId,
  targetNodeId
}: {
  nodeIds: string[]
  sourceNodeId: string
  targetNodeId: string
}): string[] => {
  const __new = [...nodeIds]
  const srcIdx = __new.indexOf(sourceNodeId)

  if (srcIdx >= 0) {
    __new.splice(srcIdx + 1, 0, targetNodeId)
  }

  return __new
}
