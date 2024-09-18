import ListIcon from './components/Icon/ListIcon'
import IconButton from './components/IconButton'
import SideMenuDivider from './components/SideMenuDivider'
import CharButton from './components/CharButton'
import { hstack, vstack } from '@styled-system/patterns'
import { css } from '@styled-system/css'
import Title from './components/Title'
import TopBar from './components/TopBar'

export default function App(): JSX.Element {
  return (
    <div className={vstack({ gap: 0, h: 'full' })}>
      <TopBar />
      <div className={hstack({ flex: 1, w: 'full', gap: 0 })}>
        <div
          className={vstack({
            h: 'full',
            borderRightWidth: '1px',
            borderRightColor: 'black/50',
            justify: 'space-between'
          })}
        >
          <div className={vstack({ gap: 0 })}>
            <IconButton icon={<ListIcon width="20" height="20" />} text="things" />
            <SideMenuDivider />
            <CharButton text="마케팅" />
          </div>
        </div>
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
