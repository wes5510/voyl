import TopBar from './TopBar'
import SideBar from './SideBar'
import Body from './Body'
import { hstack, vstack } from '@/styled-system/patterns'

export default function App(): JSX.Element {
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
