import { atom } from 'jotai'
import { atomFamily } from 'jotai/vanilla/utils'
import {
  TreeModel,
  getNextNodeIdFromFocusedNodeId,
  getPrevNodeIdFromFocusedNodeId,
  getValidDepth,
  indentNode,
  insertNewNodeAfter,
  moveNodeIdsByRefNode,
  outdentNode,
  removeChildNodes,
  removeNodeId,
} from './tree.model'
import { collapsedAtom, depthAtom, nodeAtom } from '../node'
import { NodeModel } from '../node/node.model'

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

  const { targetNode, prevSiblingNode, childNodes } = ret

  set(nodeAtom({ id: targetNode.id }), targetNode)
  set(nodeAtom({ id: prevSiblingNode.id }), prevSiblingNode)
  childNodes.forEach((node) => {
    set(nodeAtom({ id: node.id }), node)
  })
})

const __getNodesAtom = atom((get) => get(nodeIdsAtom).map((id) => get(nodeAtom({ id }))))

export const outdentNodeAtom = atom(null, (get, set, { nodeId }: { nodeId: string }) => {
  const ret = outdentNode({
    nodes: get(__getNodesAtom),
    targetNode: get(nodeAtom({ id: nodeId })),
  })

  if (!ret) {
    return
  }

  const { targetNode, childNodes, nodeIds } = ret

  set(nodeIdsAtom, nodeIds)
  set(nodeAtom({ id: targetNode.id }), targetNode)
  childNodes.forEach((node) => {
    set(nodeAtom({ id: node.id }), node)
  })
})

export const moveNodeAtom = atom(
  null,
  (
    get,
    set,
    {
      refNodeId,
      targetNode,
      deltaDepth,
    }: { refNodeId: string; targetNode: NodeModel; deltaDepth: number },
  ) => {
    set(
      depthAtom(targetNode.id),
      getValidDepth({
        nodes: get(__getNodesAtom),
        refNode: get(nodeAtom({ id: refNodeId })),
        targetNode,
        deltaDepth,
      }),
    )
    set(
      nodeIdsAtom,
      moveNodeIdsByRefNode({
        nodeIds: get(treeAtom).nodeIds,
        refNodeId,
        targetNodeId: targetNode.id,
      }),
    )
  },
)

export const collapsedNodeAtom = atomFamily((nodeId: string) =>
  atom(
    (get) => get(collapsedAtom(nodeId)),
    (get, set, { collapsed }: { collapsed: boolean }) => {
      set(collapsedAtom(nodeId), collapsed)
      if (collapsed) {
        set(
          nodeIdsAtom,
          removeChildNodes({
            nodes: get(__getNodesAtom),
            parentNode: get(nodeAtom({ id: nodeId })),
          }).map((node) => node.id),
        )
      }
    },
  ),
)

export const draggingNodeAtom = atom<NodeModel | undefined>(undefined)

export const setDraggingNodeByNodeIdAtom = atom(
  null,
  (get, set, { nodeId }: { nodeId?: string }) => {
    set(
      draggingNodeAtom,
      nodeId ? JSON.parse(JSON.stringify(get(nodeAtom({ id: nodeId })))) : undefined,
    )
    if (nodeId) {
      set(collapsedNodeAtom(nodeId), { collapsed: true })
    }
  },
)
