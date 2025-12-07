import { contextBridge, ipcRenderer } from 'electron'
import type { ChannelApi } from '../common/channel.type.js'

// 명시적 함수 객체 생성 (Proxy는 structured clone 불가)
const api: ChannelApi = {
  'app.isInitialized': () => ipcRenderer.invoke('app.isInitialized'),
  'app.selectWorkspaceDirPath': () =>
    ipcRenderer.invoke('app.selectWorkspaceDirPath'),
  'app.initialize': (workspaceDirPath) =>
    ipcRenderer.invoke('app.initialize', workspaceDirPath),
  'app.sync': () => ipcRenderer.invoke('app.sync'),

  'tree.getRootNodeId': () => ipcRenderer.invoke('tree.getRootNodeId'),
  'tree.getNode': (params) => ipcRenderer.invoke('tree.getNode', params),
  'tree.getViewNodes': (params) =>
    ipcRenderer.invoke('tree.getViewNodes', params),
  'tree.updateNodeTitle': (params) =>
    ipcRenderer.invoke('tree.updateNodeTitle', params),
  'node.getPreviousFocusableNodeId': (params) =>
    ipcRenderer.invoke('node.getPreviousFocusableNodeId', params),

  'favorite.getAll': () => ipcRenderer.invoke('favorite.getAll'),

  'treeView.addNewNodeAfter': (params) =>
    ipcRenderer.invoke('treeView.addNewNodeAfter', params),
  'treeView.removeNode': (params) =>
    ipcRenderer.invoke('treeView.removeNode', params),
}

contextBridge.exposeInMainWorld('api', api)
