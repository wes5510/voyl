import CharButton from './CharButton'
import useFavoriteManagerStore from '@/models/favoriteManager/store'

export default function FavoriteMenu(): JSX.Element {
  const favorites = useFavoriteManagerStore((state) => state.favorites)

  return (
    <>
      {favorites.map((fav) => (
        <CharButton key={fav.id} text={fav.text} />
      ))}
    </>
  )
}
