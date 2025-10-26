import { IpcMain } from 'electron'
import { CHANNELS } from '../../common/channel.const.js'
// import { getNode, getRootNodeId } from '../model/tree/index.js'
// import { getTreeViewNodes } from '../model/treeView/index.js'

export default function treeHandlers(ipcMain: IpcMain) {
  ipcMain.handle(CHANNELS.GET_ROOT_NODE_ID, () => {
    // return getRootNodeId()
    return 'root'
  })

  ipcMain.handle(CHANNELS.GET_NODE, () => {
    // return getNode({ nodeId })
    return {
      id: 'node-1',
      parentId: 'root',
      childIds: ['child-1'],
      title: 'Node 1',
      content: 'Content 1',
    }
  })

  ipcMain.handle(CHANNELS.GET_VIEW_TREE_NODES, () => {
    // 하드코딩된 확장 상태 (프로토타이핑)
    // const expandedNodeIds = [topNodeId, 'child-1', 'grandchild-1']
    // return getTreeViewNodes({ topNodeId, expandedNodeIds })
    return [
      { nodeId: 'node-1', depth: 0 },
      { nodeId: 'child-1', depth: 1 },
      { nodeId: 'grandchild-1', depth: 2 },
    ]
  })
}
