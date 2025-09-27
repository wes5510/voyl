import { CHANNELS } from '@/common/channel.const'

export const updateNodeTitle = ({ nodeId, title }: { nodeId: string; title: string }) => {
  return window.electron.ipcRenderer.invoke(CHANNELS.UPDATE_NODE_TITLE, { nodeId, title })
}
