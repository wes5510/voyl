import { Suspense } from 'react'
import NodesPage from './nodes'
import TopBar from './TopBar'
import SideBar from './SideBar'
import { Route, Routes } from 'react-router'
import AppGuard from './AppGuard'

export default function IndexPage() {
  return (
    <Suspense fallback={null}>
      <AppGuard>
        <div className="flex h-screen flex-col gap-0">
          <TopBar />
          <div className="flex w-full flex-1 flex-row gap-0">
            <SideBar />
            <Routes>
              <Route path="nodes" element={<NodesPage />} />
              <Route path="nodes/:nodeId" element={<NodesPage />} />
              <Route path="*" element={<NodesPage />} />
            </Routes>
          </div>
        </div>
      </AppGuard>
    </Suspense>
  )
}
