import { IpcMain, IpcMainInvokeEvent } from 'electron'
import { CHANNELS } from '../../common/channel.const.js'
import TreeModel from '../model/tree/index.js'
import TreeViewModel from '../model/treeView/index.js'
import NodeModel from '../model/node/index.js'

export default function treeHandlers(ipcMain: IpcMain) {
  ipcMain.handle(CHANNELS.GET_ROOT_NODE_ID, () => {
    return TreeModel.getRootNodeId()
  })

  ipcMain.handle(
    CHANNELS.GET_NODE,
    (_event: IpcMainInvokeEvent, { nodeId }: { nodeId: string }) => {
      return NodeModel.getNodeById({ id: nodeId })
    },
  )

  ipcMain.handle(
    CHANNELS.GET_VIEW_TREE_NODES,
    (_event: IpcMainInvokeEvent, { topNodeId }: { topNodeId: string }) => {
      // 하드코딩된 확장 상태 (프로토타이핑)
      const expandedNodeIds = [topNodeId, 'child-1', 'grandchild-1']
      return TreeViewModel.getTreeViewNodes({ topNodeId, expandedNodeIds })
    },
  )

  ipcMain.handle(
    CHANNELS.UPDATE_NODE_TITLE,
    (
      _event: IpcMainInvokeEvent,
      { nodeId, title }: { nodeId: string; title: string },
    ) => {
      return NodeModel.updateNodeTitle({ id: nodeId, title })
    },
  )
}
