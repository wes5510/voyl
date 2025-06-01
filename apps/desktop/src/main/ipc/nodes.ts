import { IpcMain } from 'electron'
import { getNodeTitleById } from '../models/node/index.js'
import { CHANNELS } from '../common/channel.const.js'

export default function nodesHandlers(ipcMain: IpcMain) {
  ipcMain.handle(CHANNELS.GET_NODE_TITLE, async (_event, id: string) => {
    return getNodeTitleById({ id })
  })
}
