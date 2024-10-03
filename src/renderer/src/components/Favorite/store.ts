import { atom } from 'jotai'
import { FavoriteModel } from './model'

export const favoritesAtom = atom<FavoriteModel[]>([
  { id: '1', text: 'One' },
  { id: '2', text: 'Two' }
])
