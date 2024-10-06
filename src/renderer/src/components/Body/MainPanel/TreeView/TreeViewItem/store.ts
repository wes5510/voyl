import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { createNewNode, getDepthBySourceNode, NodeModel } from './model'

interface NodeAtom {
  id: NodeModel['id']
  depth?: NodeModel['depth']
  collapsed?: NodeModel['collapsed']
  text?: NodeModel['text']
}

export const nodeAtom = atomFamily(
  ({ id, depth, text, collapsed }: NodeAtom) =>
    atom<NodeModel>({
      id,
      depth: depth ?? 0,
      text: text ?? '',
      collapsed: collapsed ?? true
    }),
  (a, b) => a.id === b.id
)

export const collapsedAtom = atomFamily((id: string) =>
  atom(
    (get) => get(nodeAtom({ id })).collapsed,
    (get, set, value: boolean) => {
      const prev = get(nodeAtom({ id }))
      set(nodeAtom({ id }), { ...prev, collapsed: value })
    }
  )
)

export const textAtom = atomFamily((id: string) =>
  atom(
    (get) => get(nodeAtom({ id })).text,
    (get, set, value: string) => {
      const prev = get(nodeAtom({ id }))
      set(nodeAtom({ id }), { ...prev, text: value })
    }
  )
)

export const depthAtom = atomFamily((id: string) => atom((get) => get(nodeAtom({ id })).depth))

export const createNewNodeFromSourceNodeAtom = atom(
  null,
  (get, _set, { sourceNodeId, newNodeText }: { sourceNodeId: string; newNodeText: string }) => {
    const __new = createNewNode({
      depth: getDepthBySourceNode({
        collapsed: get(collapsedAtom(sourceNodeId)),
        depth: get(depthAtom(sourceNodeId))
      }),
      text: newNodeText
    })

    nodeAtom(__new)

    return __new
  }
)
