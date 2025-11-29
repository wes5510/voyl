import * as FavoriteModel from '../model/favorite/index.js'

export const favoriteHandlers = {
  'favorite.getAll': async (): Promise<{ id: string; text: string }[]> => {
    return FavoriteModel.getFavorites()
  },
}
