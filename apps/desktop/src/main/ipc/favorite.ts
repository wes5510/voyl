import { IpcMain } from 'electron'
import { CHANNELS } from '../../common/channel.const.js'
import { getFavorites } from '../model/favorite/index.js'

export default function favoriteHandlers(ipcMain: IpcMain) {
  ipcMain.handle(CHANNELS.GET_FAVORITES, () => {
    return getFavorites()
  })
}
