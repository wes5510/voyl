import { atom } from 'jotai'
import { insertAfter, TreeModel } from '../model/tree.model'
import { createNewNodeFromSourceNodeAtom, nodeAtom } from './node.state'

const treeAtom = atom<TreeModel>({
  nodeIds: ['1'],
})
export const nodeIdsAtom = atom((get) => get(treeAtom).nodeIds)
export const focusedNodeIdAtom = atom<string | undefined>(undefined)

export const insertAfterTreeAtom = atom(
  null,
  (get, set, { sourceNodeId, newNodeId }: { sourceNodeId: string; newNodeId: string }) => {
    set(treeAtom, {
      nodeIds: insertAfter({ nodeIds: get(treeAtom).nodeIds, sourceNodeId, newNodeId }),
    })
    set(focusedNodeIdAtom, newNodeId)
  },
)

export const insertAfterNewNodeInTreeAtom = atom(
  null,
  (_get, set, { newNodeText, sourceNodeId }: { newNodeText: string; sourceNodeId: string }) => {
    const __new = set(createNewNodeFromSourceNodeAtom, { sourceNodeId, newNodeText })
    set(insertAfterTreeAtom, { sourceNodeId, newNodeId: __new.id })
  },
)

const focusedNodeIndexAtom = atom((get) => {
  const nodeId = get(focusedNodeIdAtom)
  if (!nodeId) {
    return -1
  }

  return get(treeAtom).nodeIds.indexOf(nodeId)
})

export const updateFocusToNextNodeAtom = atom(null, (get, set) => {
  const { nodeIds } = get(treeAtom)
  const idx = get(focusedNodeIndexAtom)
  if (idx === -1 || idx === nodeIds.length - 1) {
    return
  }

  set(focusedNodeIdAtom, nodeIds[idx + 1])
})

export const updateFocusToPrevNodeAtom = atom(null, (get, set) => {
  const idx = get(focusedNodeIndexAtom)
  if (idx <= 0) {
    return
  }

  const { nodeIds } = get(treeAtom)
  set(focusedNodeIdAtom, nodeIds[idx - 1])
})

const removeNodeIdAtom = atom(null, (get, set, { nodeId }: { nodeId: string }) => {
  set(treeAtom, { nodeIds: get(treeAtom).nodeIds.filter((id) => id !== nodeId) })
})

export const removeNodeInTreeAtom = atom(null, (_get, set, { nodeId }: { nodeId: string }) => {
  set(updateFocusToPrevNodeAtom)
  set(removeNodeIdAtom, { nodeId })
  nodeAtom.remove({ id: nodeId })
})
