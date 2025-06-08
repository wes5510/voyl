export const CHANNELS = {
  GET_NODE_TITLE: '/nodes/title/get',
  GET_NODE: '/nodes/get',
  GET_FAVORITES: '/favorites/get',
} as const

export type Channel = keyof typeof CHANNELS
