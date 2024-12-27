import { create } from 'zustand'
import { FavoritesManagerEntity } from './favoriteManager'

const useFavoriteManagerStore = create<FavoritesManagerEntity>(() => ({
  favorites: [
    { id: '1', text: 'One' },
    { id: '2', text: 'Two' },
  ],
}))

export default useFavoriteManagerStore
