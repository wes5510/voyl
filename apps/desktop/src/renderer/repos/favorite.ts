import { CHANNELS } from '../../common/channel.const.js'

export const fetchFavorites = async (): Promise<{ id: string; text: string }[]> => {
  const favorites = await window.electron.ipcRenderer.invoke(CHANNELS.GET_FAVORITES)
  return favorites
}
