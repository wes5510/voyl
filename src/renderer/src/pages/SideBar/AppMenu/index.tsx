import ListIcon from 'src/renderer/src/shared/ListIcon'
import IconButton from './IconButton'

export default function AppMenu(): JSX.Element {
  return <IconButton icon={<ListIcon width="20" height="20" />} text="things" />
}
