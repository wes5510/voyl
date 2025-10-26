export const CHANNELS = {
  // App initialization channels
  IS_INITIALIZED: '/app/is-initialized',
  SELECT_WORKSPACE_DIR_PATH: '/app/workspace/select-dir-path',
  INITIALIZE_APP: '/app/initialize',
  SYNC_APP: '/app/sync',

  // Node channels
  GET_NODE_TABLE: '/nodes/table/get',
  GET_NODE: '/tree/node/get',
  GET_NODE_TITLE: '/nodes/title/get',
  UPDATE_NODE_TITLE: '/nodes/title/update',
  GET_ROOT_NODE_ID: '/tree/root-node-id/get',
  GET_FAVORITES: '/favorites/get',
  GET_VIEW_TREE_NODES: '/view/tree/nodes/get',
} as const

export type Channel = keyof typeof CHANNELS
