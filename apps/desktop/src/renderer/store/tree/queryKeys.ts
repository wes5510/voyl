export const QUERY_KEYS = {
  all: ['tree'] as const,
  rootNodeId: () => [...QUERY_KEYS.all, 'rootNodeId'] as const,
  nodes: () => [...QUERY_KEYS.all, 'nodes'] as const,
  node: ({ nodeId }: { nodeId?: string }) => [...QUERY_KEYS.nodes(), nodeId] as const,
  nodeTitle: ({ nodeId }: { nodeId?: string }) => [...QUERY_KEYS.nodes(), nodeId, 'title'] as const,
}
