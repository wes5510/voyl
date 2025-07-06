import { IpcMain } from 'electron'
import { getNodeTitleById, getNodeById } from '../models/node/index.js'
import { CHANNELS } from '../common/channel.const.js'

export default function nodesHandlers(ipcMain: IpcMain) {
  ipcMain.handle(CHANNELS.GET_NODE_TITLE, (_event, id: string) => {
    return getNodeTitleById({ id })
  })

  ipcMain.handle(CHANNELS.GET_NODE, (_event, { id }: { id: string }) => {
    return getNodeById({ id })
  })
}
