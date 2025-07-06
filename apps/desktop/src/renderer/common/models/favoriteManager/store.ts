import { create } from 'zustand'
import { FavoritesManagerEntity } from '.'
import { fetchFavorites } from '@/renderer/repos/favorite'

const useFavoriteManagerStore = create<{
  __entity: FavoritesManagerEntity | null
  favorites: () => FavoritesManagerEntity['favorites']
}>((set, get) => ({
  __entity: null,
  favorites: () => {
    const entity = get().__entity
    if (entity) {
      return entity.favorites
    }

    const ret = fetchFavorites().then((favorites) => {
      set({ __entity: { favorites } })
      return favorites
    })

    throw ret
  },
}))

export default useFavoriteManagerStore
