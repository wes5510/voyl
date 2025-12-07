/// <reference types="vite/client" />

import type { ChannelApi } from '../main/ipc/index'

declare global {
  interface Window {
    api: ChannelApi
  }
}
