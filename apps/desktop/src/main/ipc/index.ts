import { ipcMain } from 'electron'
import { appHandlers } from './app.js'
import { treeHandlers } from './tree.js'
import { favoriteHandlers } from './favorite.js'
import { treeViewHandlers } from './treeView.js'

// 모든 핸들러 합치기
const handlers = {
  ...appHandlers,
  ...treeHandlers,
  ...favoriteHandlers,
  ...treeViewHandlers,
}

// 타입 추출
export type Handlers = typeof handlers

type HandlerParams<T> = T extends () => unknown
  ? never
  : T extends (params: infer P) => unknown
    ? P
    : never

type HandlerResult<T> = T extends (...args: never[]) => infer R
  ? Awaited<R>
  : never

export type ChannelApi = {
  [K in keyof Handlers]: HandlerParams<Handlers[K]> extends never
    ? () => Promise<HandlerResult<Handlers[K]>>
    : (params: HandlerParams<Handlers[K]>) => Promise<HandlerResult<Handlers[K]>>
}

export type ChannelKeys = keyof Handlers

// 자동 등록
export function registerHandlers() {
  Object.entries(handlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, (_, params) =>
      (handler as (params: unknown) => unknown)(params),
    )
  })
}
