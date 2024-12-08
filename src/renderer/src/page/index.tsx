import { hstack, vstack } from '@/styled-system/patterns'
import Body from './ui/Body'
import TopBar from './ui/TopBar'
import SideBar from './ui/SideBar'

export default function IndexPage(): JSX.Element {
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
