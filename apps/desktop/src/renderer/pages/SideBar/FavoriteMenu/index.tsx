import CharButton from './CharButton'
import useFavoriteManagerStore from '@/renderer/models/favoriteManager/store'

export default function FavoriteMenu() {
  const favorites = useFavoriteManagerStore((state) => state.favorites())

  return (
    <>
      {favorites.map((fav) => (
        <CharButton key={fav.id} text={fav.text} />
      ))}
    </>
  )
}
