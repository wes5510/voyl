import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { createNewNode, NodeModel, updateCollapsed, updateDepth, updateTitle } from './node.model'

interface NodeAtom {
  id: NodeModel['id']
  depth?: NodeModel['depth']
  collapsed?: NodeModel['collapsed']
  title?: NodeModel['title']
}

export const nodeAtom = atomFamily(
  ({ id, depth, title, collapsed }: NodeAtom) =>
    atom<NodeModel>(
      createNewNode({
        id,
        depth,
        collapsed,
        title,
      }),
    ),
  (a, b) => a.id === b.id,
)

export const collapsedAtom = atomFamily((id: string) =>
  atom(
    (get) => get(nodeAtom({ id })).collapsed,
    (_get, set, value: boolean) => {
      set(nodeAtom({ id }), (prev) => updateCollapsed({ node: prev, collapsed: value }))
    },
  ),
)

export const titleAtom = atomFamily((id: string) =>
  atom(
    (get) => get(nodeAtom({ id })).title,
    (_get, set, value: string) => {
      set(nodeAtom({ id }), (prev) => updateTitle({ node: prev, title: value }))
    },
  ),
)

export const depthAtom = atomFamily((id: string) =>
  atom(
    (get) => get(nodeAtom({ id })).depth,
    (_get, set, value: number) => {
      set(nodeAtom({ id }), (prev) => updateDepth({ node: prev, depth: value }))
    },
  ),
)
