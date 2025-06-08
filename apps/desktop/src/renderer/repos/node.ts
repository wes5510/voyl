import { CHANNELS } from '../../common/channel.const.js'

export const getNode = async (nodeId: string) => {
  const node = await window.electron.ipcRenderer.invoke(CHANNELS.GET_NODE, { id: nodeId })
  return node
}
