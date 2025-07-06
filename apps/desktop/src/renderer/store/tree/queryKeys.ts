export const QUERY_KEYS = {
  all: ['tree'] as const,
  rootNodeId: () => [...QUERY_KEYS.all, 'rootNodeId'] as const,
}
