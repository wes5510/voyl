import { atom } from 'jotai'
import { insertAfter, TreeModel } from './model'
import { createNewNodeFromSourceNodeAtom } from './TreeViewItem/store'

const treeAtom = atom<TreeModel>({
  nodeIds: ['1']
})
export const nodeIdsAtom = atom((get) => get(treeAtom).nodeIds)
export const focusedNodeIdAtom = atom<string | null>(null)

export const insertAfterTreeAtom = atom(
  null,
  (get, set, { sourceNodeId, newNodeId }: { sourceNodeId: string; newNodeId: string }) => {
    set(treeAtom, {
      nodeIds: insertAfter({ nodeIds: get(treeAtom).nodeIds, sourceNodeId, newNodeId })
    })
    set(focusedNodeIdAtom, newNodeId)
  }
)

export const insertAfterNewNodeInTreeAtom = atom(
  null,
  (_get, set, { newNodeText, sourceNodeId }: { newNodeText: string; sourceNodeId: string }) => {
    const __new = set(createNewNodeFromSourceNodeAtom, { sourceNodeId, newNodeText })
    set(insertAfterTreeAtom, { sourceNodeId, newNodeId: __new.id })
  }
)
