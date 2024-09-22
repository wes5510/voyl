import { vstack } from '@styled-system/patterns'
import Divider from './Divider'
import { FavoriteMenu } from './FavoriteMenu'
import { AppMenu } from './AppMenu'

export default function SideBar(): JSX.Element {
  return (
    <div
      className={vstack({
        h: 'full',
        borderRightWidth: '1px',
        borderRightColor: 'black/50',
        justify: 'space-between'
      })}
    >
      <div className={vstack({ gap: 0 })}>
        <AppMenu />
        <Divider />
        <FavoriteMenu />
      </div>
    </div>
  )
}
