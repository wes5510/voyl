import { create } from 'zustand'

export type Node = {
  id: string
  text: string
  collapsed: boolean
}

interface TreeStore {
  nodeMap: Map<Node['id'], Node>
  setNodes: (nodes: Node[]) => void
  setNodeText: (data: { id: Node['id']; text: Node['text'] }) => void
  toggleCollapsed: (id: Node['id']) => void
}

const useTreeStore = create<TreeStore>((set) => ({
  nodeMap: new Map(),
  setNodes: (nodes): void => {
    set({ nodeMap: new Map(nodes.map((node) => [node.id, node])) })
  },
  setNodeText: ({ id, text }: { id: Node['id']; text: Node['text'] }): void => {
    set((prev) => {
      const node = prev.nodeMap.get(id)
      return node ? { nodeMap: new Map(prev.nodeMap).set(id, { ...node, text }) } : prev
    })
  },
  toggleCollapsed: (id: Node['id']): void => {
    set((prev) => {
      const node = prev.nodeMap.get(id)
      return node
        ? { nodeMap: new Map(prev.nodeMap).set(id, { ...node, collapsed: !node.collapsed }) }
        : prev
    })
  }
}))

export default useTreeStore
