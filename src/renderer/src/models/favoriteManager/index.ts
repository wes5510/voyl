import { FavoriteEntity } from './favorite'

export interface FavoritesManagerEntity {
  favorites: FavoriteEntity[]
}

export const addFavorite = ({
  entity,
  newFavorite,
}: {
  entity: FavoritesManagerEntity
  newFavorite: FavoriteEntity
}): FavoritesManagerEntity => ({
  favorites: [...entity.favorites, newFavorite],
})

export const removeFavorite = ({
  entity,
  id,
}: {
  entity: FavoritesManagerEntity
  id: string
}): FavoritesManagerEntity => ({
  favorites: entity.favorites.filter((fav) => fav.id !== id),
})

export const updateFavoriteName = ({
  entity,
  id,
  newText,
}: {
  entity: FavoritesManagerEntity
  id: string
  newText: string
}): FavoritesManagerEntity =>
  updateFavorite({
    entity,
    favorite: { id, text: newText },
  })

const updateFavorite = ({
  entity,
  favorite,
}: {
  entity: FavoritesManagerEntity
  favorite: {
    id: FavoriteEntity['id']
  } & Partial<FavoriteEntity>
}): FavoritesManagerEntity => ({
  favorites: entity.favorites.map((fav) =>
    fav.id === favorite.id ? { ...fav, ...favorite } : fav,
  ),
})
