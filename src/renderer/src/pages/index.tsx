import { hstack, vstack } from '@/styled-system/patterns'
import NodesPage from './nodes'
import TopBar from './TopBar'
import SideBar from './SideBar'
import { Route, Routes } from 'react-router'

export default function IndexPage(): JSX.Element {
  return (
    <div className={vstack({ gap: 0, h: 'full' })}>
      <TopBar />
      <div className={hstack({ flex: 1, w: 'full', gap: 0 })}>
        <SideBar />
        <Routes>
          <Route path="nodes" element={<NodesPage />} />
          <Route path="*" element={<NodesPage />} />
        </Routes>
      </div>
    </div>
  )
}
