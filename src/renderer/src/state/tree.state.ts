import { atom } from 'jotai'
import {
  TreeModel,
  getNextNodeIdFromFocusedNodeId,
  getPrevNodeIdFromFocusedNodeId,
  indentNode,
  insertNewNodeAfter,
  removeNodeId,
} from '@/model/tree.model'
import { nodeAtom } from './node.state'

const treeAtom = atom<TreeModel>({
  nodeIds: ['1'],
  focusedNodeId: '1',
})
export const nodeIdsAtom = atom(
  (get) => get(treeAtom).nodeIds,
  (_get, set, nodeIds: string[]) => {
    set(treeAtom, (prev) => ({ ...prev, nodeIds }))
  },
)
export const focusedNodeIdAtom = atom(
  (get) => get(treeAtom).focusedNodeId,
  (_get, set, focusedNodeId?: string) => {
    set(treeAtom, (prev) => ({ ...prev, focusedNodeId }))
  },
)

export const insertNewNodeAfterAtom = atom(
  null,
  (get, set, { refNodeId, newNodeTitle }: { refNodeId: string; newNodeTitle: string }) => {
    const { nodeIds, focusedNodeId, newNode } = insertNewNodeAfter({
      nodeIds: get(treeAtom).nodeIds,
      refNode: get(nodeAtom({ id: refNodeId })),
      newNodeTitle,
    })

    set(treeAtom, { nodeIds, focusedNodeId })
    set(nodeAtom({ id: newNode.id }), newNode)
  },
)

export const updateFocusToNextNodeAtom = atom(null, (get, set) => {
  set(focusedNodeIdAtom, getNextNodeIdFromFocusedNodeId(get(nodeIdsAtom), get(focusedNodeIdAtom)))
})

export const updateFocusToPrevNodeAtom = atom(null, (get, set) => {
  set(focusedNodeIdAtom, getPrevNodeIdFromFocusedNodeId(get(nodeIdsAtom), get(focusedNodeIdAtom)))
})

export const removeNodeAtom = atom(null, (get, set, { nodeId }: { nodeId: string }) => {
  set(updateFocusToPrevNodeAtom)
  set(nodeIdsAtom, removeNodeId(get(nodeIdsAtom), nodeId))
  nodeAtom.remove({ id: nodeId })
})

export const indentNodeAtom = atom(null, (get, set, { nodeId }: { nodeId: string }) => {
  const ret = indentNode(get(__getNodesAtom), get(nodeAtom({ id: nodeId })))

  if (!ret) {
    return
  }

  const { targetNode, prevSiblingNode } = ret
  set(nodeAtom({ id: targetNode.id }), targetNode)
  set(nodeAtom({ id: prevSiblingNode.id }), prevSiblingNode)
})

const __getNodesAtom = atom((get) => get(nodeIdsAtom).map((id) => get(nodeAtom({ id }))))
