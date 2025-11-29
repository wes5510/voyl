/// <reference types="vite/client" />

import { ElectronAPI } from '@electron-toolkit/preload'
import type { ChannelApi } from '../common/channel.type'

declare global {
  interface Window {
    electron: ElectronAPI
    api: ChannelApi
  }
}
