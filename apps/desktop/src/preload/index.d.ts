import { ElectronAPI } from '@electron-toolkit/preload'

interface IElectronAPI {
  isInitialized(): Promise<boolean>
  selectWorkspacePath(): Promise<string | null>
  initializeApp(path: string): Promise<void>
  loadApp(): Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IElectronAPI
  }
}
