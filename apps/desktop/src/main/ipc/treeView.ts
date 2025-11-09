import { IpcMain, IpcMainInvokeEvent } from 'electron'
import { CHANNELS } from '../../common/channel.const.js'
import TreeViewModel from '../model/treeView/index.js'

export default function treeViewHandlers(ipcMain: IpcMain) {
  ipcMain.handle(
    CHANNELS.ADD_NEW_NODE_AFTER,
    (
      _event: IpcMainInvokeEvent,
      { nodeId, title }: { nodeId: string; title: string },
    ) => {
      return TreeViewModel.addNewNodeAfter({
        nodeId,
        title,
      })
    },
  )
}
