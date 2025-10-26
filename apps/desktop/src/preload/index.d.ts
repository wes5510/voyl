import { ElectronAPI } from '@electron-toolkit/preload'

interface ElectronIPC {
  isInitialized(): Promise<boolean>
  selectWorkspaceDirPath(): Promise<string | null>
  initializeApp(path: string): Promise<void>
  loadApp(): Promise<void>
  syncApp(): Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: ElectronIPC
  }
}
