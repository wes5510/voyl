import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { CHANNELS } from '../common/channel.const.js'

// Custom APIs for renderer
const api = {
  isInitialized: () => ipcRenderer.invoke(CHANNELS.IS_INITIALIZED),
  selectWorkspacePath: () => ipcRenderer.invoke(CHANNELS.SELECT_WORKSPACE_PATH),
  initializeApp: (path: string) => ipcRenderer.invoke(CHANNELS.INITIALIZE_APP, path),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI
  // @ts-expect-error (define in dts)
  window.api = api
}
