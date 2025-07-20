export const TREE_VIEW_QUERY_KEYS = {
  all: ['treeView'] as const,
  nodes: ({ topNodeId }: { topNodeId?: string }) =>
    [...TREE_VIEW_QUERY_KEYS.all, 'nodes', topNodeId] as const,
}
