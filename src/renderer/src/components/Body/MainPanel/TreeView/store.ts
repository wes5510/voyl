import { atom } from 'jotai'
import { insertAfter, TreeModel } from './model'

const treeAtom = atom<TreeModel>({
  nodeIds: ['1']
})

export const nodeIdsAtom = atom((get) => get(treeAtom).nodeIds)

export const insertAfterTreeAtom = atom(null, (get, set, { sourceNodeId, targetNodeId }) => {
  set(treeAtom, {
    nodeIds: insertAfter({ nodeIds: get(treeAtom).nodeIds, sourceNodeId, targetNodeId })
  })
})

export const focusedNodeIdAtom = atom<string | null>(null)
