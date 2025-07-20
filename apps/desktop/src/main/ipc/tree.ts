import { IpcMain } from 'electron'
import { CHANNELS } from '../../common/channel.const.js'
import { getNode, getRootNodeId } from '../models/tree/index.js'
import { getTreeViewNodes } from '../models/treeView/index.js'

export default function treeHandlers(ipcMain: IpcMain) {
  ipcMain.handle(CHANNELS.GET_ROOT_NODE_ID, () => {
    return getRootNodeId()
  })

  ipcMain.handle(CHANNELS.GET_NODE, (_, { nodeId }: { nodeId: string }) => {
    return getNode({ nodeId })
  })

  ipcMain.handle(CHANNELS.GET_VIEW_TREE_NODES, (_, { topNodeId }: { topNodeId: string }) => {
    // 하드코딩된 확장 상태 (프로토타이핑)
    const expandedNodeIds = [topNodeId, 'child-1', 'grandchild-1']
    return getTreeViewNodes({ topNodeId, expandedNodeIds })
  })
}
