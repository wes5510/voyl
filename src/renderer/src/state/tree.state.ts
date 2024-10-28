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

const updateFocusToPrevNodeAtom = atom(null, (get, set, { nodeId }: { nodeId: string }) => {
  const { nodeIds } = get(treeAtom)
  const srcIdx = nodeIds.indexOf(nodeId)
  if (srcIdx <= 0) {
    return
  }

  set(focusedNodeIdAtom, nodeIds[srcIdx - 1])
})

const removeNodeIdAtom = atom(null, (get, set, { nodeId }: { nodeId: string }) => {
  set(treeAtom, { nodeIds: get(treeAtom).nodeIds.filter((id) => id !== nodeId) })
})

export const removeNodeInTreeAtom = atom(null, (_get, set, { nodeId }: { nodeId: string }) => {
  set(updateFocusToPrevNodeAtom, { nodeId })
  set(removeNodeIdAtom, { nodeId })
  nodeAtom.remove({ id: nodeId })
})
