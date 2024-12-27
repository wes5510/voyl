import CharButton from './CharButton'
import useFavoriteManagerStore from '@/features/favoriteManager/model'

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
