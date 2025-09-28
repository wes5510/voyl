import CharButton from './CharButton'

export default function FavoriteMenu() {
  const favorites: Array<{ id: string; text: string }> = []

  return (
    <>
      {favorites.map((fav) => (
        <CharButton key={fav.id} text={fav.text} />
      ))}
    </>
  )
}
