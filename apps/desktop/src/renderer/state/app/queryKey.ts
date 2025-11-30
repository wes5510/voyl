export const QUERY_KEYS = {
  all: ['app'] as const,
  initialization: () => [...QUERY_KEYS.all, 'initialization'] as const,
  config: () => [...QUERY_KEYS.all, 'config'] as const,
  workspace: () => [...QUERY_KEYS.all, 'workspace'] as const,
}