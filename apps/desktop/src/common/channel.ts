// IPC 채널 정의
export const CHANNELS = [
  'app.isInitialized',
  'app.selectWorkspaceDirPath',
  'app.initialize',
  'app.sync',
  'tree.getRootNodeId',
  'tree.getNode',
  'tree.getViewNodes',
  'tree.updateNodeTitle',
  'node.getPreviousFocusableNodeId',
  'favorite.getAll',
  'treeView.addNewNodeAfter',
  'treeView.removeNode',
] as const

export type Channel = (typeof CHANNELS)[number]
