import ListIcon from './components/Icon/ListIcon'
import { hstack, vstack } from '@styled-system/patterns'
import { css } from '@styled-system/css'
import Title from './components/Title'
import TopBar from './components/TopBar'
import { SideBar } from './components/SideBar'
import { useFavoriteStore } from './components/Favorite'
import { useEffect } from 'react'
import { usePathStore } from './components/Path'

export default function App(): JSX.Element {
  const setFavorite = useFavoriteStore((store) => store.set)
  const setPath = usePathStore((store) => store.set)

  useEffect(() => {
    setFavorite([
      { id: '1', name: 'One' },
      { id: '2', name: 'Two' }
    ])
  }, [setFavorite])

  useEffect(() => {
    setPath([
      {
        icon: <ListIcon width="16" height="16" />,
        text: 'Things',
        url: '/'
      }
    ])
  }, [setPath])

  return (
    <div className={vstack({ gap: 0, h: 'full' })}>
      <TopBar />
      <div className={hstack({ flex: 1, w: 'full', gap: 0 })}>
        <SideBar />
        <div className={css({ flex: 1, w: 'full', h: 'full', pos: 'relative' })}>
          <div
            className={css({
              pos: 'absolute',
              top: 0,
              left: 0,
              w: 'full',
              h: 'full',
              overflowY: 'auto'
            })}
          >
            <div className={vstack({ p: 6, gap: 6, w: 'full', h: 'full', alignItems: 'normal' })}>
              <Title icon={ListIcon} text="Things" />
              <div>Body</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
