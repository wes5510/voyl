import { create } from 'zustand'

export type Favorite = {
  id: string
  name: string
}

interface FavoriteStore {
  favorites: Favorite[]
  set: (favorites: Favorite[]) => void
  add(favorite: Favorite): void
  remove(id: string): void
  updateName({ id, text }: { id: string; text: string }): void
}

const useFavoriteStore = create<FavoriteStore>((set) => ({
  favorites: [],
  set: (favorites): void => {
    set({ favorites })
  },
  add: (favorite): void => {
    set((state) => ({ favorites: [...state.favorites, favorite] }))
  },
  remove: (id): void => {
    set((state) => ({ favorites: state.favorites.filter((favorite) => favorite.id !== id) }))
  },
  updateName: ({ id, text }): void => {
    set((state) => ({
      favorites: state.favorites.map((favorite) =>
        favorite.id === id ? { ...favorite, text } : favorite
      )
    }))
  }
}))

export default useFavoriteStore
