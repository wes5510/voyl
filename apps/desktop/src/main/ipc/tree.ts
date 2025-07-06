import { IpcMain } from 'electron'
import { CHANNELS } from '../common/channel.const.js'
import { getNode, getRootNodeId } from '../models/tree/index.js'

export default function treeHandlers(ipcMain: IpcMain) {
  ipcMain.handle(CHANNELS.GET_ROOT_NODE_ID, () => {
    return getRootNodeId()
  })

  ipcMain.handle(CHANNELS.GET_NODE, (_, { nodeId }: { nodeId: string }) => {
    return getNode({ nodeId })
  })
}
