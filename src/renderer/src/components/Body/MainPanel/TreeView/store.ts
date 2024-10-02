import { atom } from 'jotai'
import { TreeModel } from './model'

const treeAtom = atom<TreeModel>({
  nodeIds: ['1']
})

export const nodeIdsAtom = atom((get) => get(treeAtom).nodeIds)
