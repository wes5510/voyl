export interface FocusManagerModel {
  focusedNodeId?: string
}

export const isFocused = ({
  focusedNodeId,
  nodeId,
}: {
  focusedNodeId?: string
  nodeId: string
}): boolean => !!focusedNodeId && focusedNodeId === nodeId

export const updateFocused = ({
  nodeId,
  fallbackNodeId,
}: {
  nodeId?: string
  fallbackNodeId?: string
}): FocusManagerModel => ({
  focusedNodeId: nodeId ?? fallbackNodeId,
})
