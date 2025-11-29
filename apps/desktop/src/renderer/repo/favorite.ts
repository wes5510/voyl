export const fetchFavorites = async (): Promise<{ id: string; text: string }[]> => {
  const favorites = await window.api['favorite.getAll']()
  return favorites
}
