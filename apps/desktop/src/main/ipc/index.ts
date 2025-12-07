import { ipcMain } from 'electron'
import { appHandlers } from './app.js'
import { treeHandlers } from './tree.js'
import { favoriteHandlers } from './favorite.js'
import { treeViewHandlers } from './treeView.js'
import type { Channel } from '../../common/channel.js'

// 모든 핸들러 합치기
const handlers = {
  ...appHandlers,
  ...treeHandlers,
  ...favoriteHandlers,
  ...treeViewHandlers,
}

// 타입 추출
type Handlers = typeof handlers

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

// 컴파일 타임 검증: channels와 handlers 일치 확인
type _AssertChannelsMatch = Channel extends keyof Handlers
  ? keyof Handlers extends Channel
    ? true
    : never
  : never
void (true as _AssertChannelsMatch)

// 자동 등록
export function registerHandlers() {
  Object.entries(handlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, (_, params) =>
      (handler as (params: unknown) => unknown)(params),
    )
  })
}
