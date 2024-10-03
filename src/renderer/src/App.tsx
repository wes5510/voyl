import { hstack, vstack } from '@styled-system/patterns'
import TopBar from './components/TopBar'
import { SideBar } from './components/SideBar'
import { Body } from './components/Body'

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
