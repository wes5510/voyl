import { useFavoriteStore } from '../../Favorite'
import CharButton from './CharButton'

export default function FavoriteMenu(): JSX.Element {
  const favorites = useFavoriteStore((store) => store.favorites)

  return (
    <>
      {favorites.map((fav) => (
        <CharButton key={fav.id} text={fav.name} />
      ))}
    </>
  )
}
