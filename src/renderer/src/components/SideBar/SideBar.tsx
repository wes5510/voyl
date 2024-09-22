import { vstack } from '@styled-system/patterns'
import IconButton from '../IconButton'
import Divider from './Divider'
import CharButton from '../CharButton'
import ListIcon from '../Icon/ListIcon'

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
        <IconButton icon={<ListIcon width="20" height="20" />} text="things" />
        <Divider />
        <CharButton text="마케팅" />
      </div>
    </div>
  )
}
