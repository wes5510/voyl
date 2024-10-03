import { useAtomValue } from 'jotai'
import { favoritesAtom } from '../../Favorite'
import CharButton from './CharButton'

export default function FavoriteMenu(): JSX.Element {
  const favorites = useAtomValue(favoritesAtom)

  return (
    <>
      {favorites.map((fav) => (
        <CharButton key={fav.id} text={fav.text} />
      ))}
    </>
  )
}
