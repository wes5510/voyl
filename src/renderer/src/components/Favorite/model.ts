export interface FavoriteModel {
  id: string
  text: string
}

export const addFavorite = ({
  favorites,
  newFavorite
}: {
  favorites: FavoriteModel[]
  newFavorite: FavoriteModel
}): FavoriteModel[] => [...favorites, newFavorite]

export const removeFavorite = ({
  favorites,
  id
}: {
  favorites: FavoriteModel[]
  id: string
}): FavoriteModel[] => favorites.filter((fav) => fav.id !== id)

export const updateFavoriteName = ({
  favorites,
  id,
  newText
}: {
  favorites: FavoriteModel[]
  id: string
  newText: string
}): FavoriteModel[] => favorites.map((fav) => (fav.id === id ? { ...fav, text: newText } : fav))
