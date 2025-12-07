/// <reference types="vite/client" />

import type { ChannelApi } from '../common/channel.type'

declare global {
  interface Window {
    api: ChannelApi
  }
}
