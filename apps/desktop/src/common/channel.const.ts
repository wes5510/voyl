export const CHANNELS = {
  // Node 관련
  GET_NODE_TABLE: '/nodes/table/get',
  GET_NODE: '/tree/node/get',
  GET_NODE_TITLE: '/nodes/title/get',
  UPDATE_NODE_TITLE: '/nodes/title/update',
  GET_ROOT_NODE_ID: '/tree/root-node-id/get',
  GET_FAVORITES: '/favorites/get',
  GET_VIEW_TREE_NODES: '/view/tree/nodes/get',
  
  // 앱 초기화 관련
  IS_INITIALIZED: '/app/is-initialized',
  SELECT_WORKSPACE_PATH: '/app/workspace/select-path',
  INITIALIZE_APP: '/app/initialize',
  LOAD_APP: '/app/load',
} as const

export type Channel = keyof typeof CHANNELS
