import NodesPage from './nodes'
import TopBar from './TopBar'
import SideBar from './SideBar'
import { Route, Routes } from 'react-router'
import InitializationGuard from './InitializationGuard'
import { Suspense } from 'react'
import Spinner from '../common/Spinner'
import SyncGuard from './SyncGuard'

export default function IndexPage() {
  return (
    <div className="flex h-screen flex-col gap-0">
      <Suspense fallback={<Spinner />}>
        <InitializationGuard>
          <SyncGuard>
            <TopBar />
            <div className="flex w-full flex-1 flex-row gap-0">
              <SideBar />
              <Routes>
                <Route path="nodes" element={<NodesPage />} />
                <Route path="nodes/:nodeId" element={<NodesPage />} />
                <Route path="*" element={<NodesPage />} />
              </Routes>
            </div>
          </SyncGuard>
        </InitializationGuard>
      </Suspense>
    </div>
  )
}
