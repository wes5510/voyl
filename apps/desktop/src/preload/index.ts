import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// App initialization APIs
const appAPI = {
  isInitialized: () => ipcRenderer.invoke('/app/is-initialized'),
  selectWorkspacePath: () => ipcRenderer.invoke('/app/workspace/select-path'),
  initializeApp: (path: string) => ipcRenderer.invoke('/app/initialize', path),
  loadApp: () => ipcRenderer.invoke('/app/load'),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronAPI', appAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI
  // @ts-expect-error (define in dts)
  window.api = api
  // @ts-expect-error (define in dts)
  window.electronAPI = appAPI
}
