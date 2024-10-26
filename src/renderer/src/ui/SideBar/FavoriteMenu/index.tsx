import { useAtomValue } from 'jotai'
import CharButton from './CharButton'
import { favoritesAtom } from 'src/renderer/src/state/favorite.state'

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
