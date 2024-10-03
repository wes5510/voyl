import { hstack, vstack } from '@styled-system/patterns'
import TopBar from './components/TopBar'
import { SideBar } from './components/SideBar'
import { useFavoriteStore } from './components/Favorite'
import { useEffect } from 'react'
import { Body } from './components/Body'

export default function App(): JSX.Element {
  const setFavorite = useFavoriteStore((store) => store.set)

  useEffect(() => {
    setFavorite([
      { id: '1', name: 'One' },
      { id: '2', name: 'Two' }
    ])
  }, [setFavorite])

  return (
    <div className={vstack({ gap: 0, h: 'full' })}>
      <TopBar />
      <div className={hstack({ flex: 1, w: 'full', gap: 0 })}>
        <SideBar />
        <Body />
      </div>
    </div>
  )
}
