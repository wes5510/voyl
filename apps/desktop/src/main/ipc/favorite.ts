import { IpcMain } from 'electron'
import { CHANNELS } from '../../common/channel.const.js'
import FavoriteModel from '../model/favorite/index.js'

export default function favoriteHandlers(ipcMain: IpcMain) {
  ipcMain.handle(CHANNELS.GET_FAVORITES, () => {
    return FavoriteModel.getFavorites()
  })
}
