import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { NodeModel } from './model'

const nodeAtom = atomFamily((id: string) =>
  atom<NodeModel>({
    id,
    depth: 1,
    collapsed: false,
    text: ''
  })
)

export const collapsedAtom = atomFamily((id: string) =>
  atom(
    (get) => get(nodeAtom(id)).collapsed,
    (get, set, value: boolean) => {
      const prev = get(nodeAtom(id))
      set(nodeAtom(id), { ...prev, collapsed: value })
    }
  )
)

export const textAtom = atomFamily((id: string) =>
  atom(
    (get) => get(nodeAtom(id)).text,
    (get, set, value: string) => {
      const prev = get(nodeAtom(id))
      set(nodeAtom(id), { ...prev, text: value })
    }
  )
)

export const depthAtom = atomFamily((id: string) => atom((get) => get(nodeAtom(id)).depth))
