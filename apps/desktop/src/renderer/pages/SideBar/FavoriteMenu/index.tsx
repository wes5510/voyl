import CharButton from './CharButton'

export default function FavoriteMenu() {
  const favorites = []

  return (
    <>
      {favorites.map((fav) => (
        <CharButton key={fav.id} text={fav.text} />
      ))}
    </>
  )
}
