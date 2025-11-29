import { ElectronAPI } from '@electron-toolkit/preload'

interface ElectronIPC {
  isInitialized(): Promise<boolean>
  selectWorkspaceDirPath(): Promise<string | null>
  initializeApp(path: string): Promise<void>
  loadApp(): Promise<void>
  syncApp(): Promise<void>
  addNewNodeAfter({
    nodeId,
    title,
  }: {
    nodeId: string
    title: string
  }): Promise<NodeDTO>
  removeNode({ nodeId }: { nodeId: string }): Promise<NodeDTO>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: ElectronIPC
  }
}
