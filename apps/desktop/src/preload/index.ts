import { contextBridge, ipcRenderer } from 'electron'
import { CHANNELS } from '../common/channel.js'
import type { ChannelApi } from '../main/ipc/index.js'

// 채널 목록 기반으로 동적 API 객체 생성
const api = Object.fromEntries(
  CHANNELS.map((channel) => [
    channel,
    (params?: unknown) => ipcRenderer.invoke(channel, params),
  ]),
) as ChannelApi

contextBridge.exposeInMainWorld('api', api)
