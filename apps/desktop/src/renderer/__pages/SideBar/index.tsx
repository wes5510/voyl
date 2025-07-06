import Divider from './Divider'
import FavoriteMenu from './FavoriteMenu'
import AppMenu from './AppMenu'
import { Suspense } from 'react'
import Skeleton from '@/renderer/common/Skeleton'

export default function SideBar() {
  return (
    <div className="flex h-full flex-col justify-between border-r border-black/50">
      <div className="flex flex-col gap-0">
        <AppMenu />
        <Divider />
        <Suspense
          fallback={
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          }
        >
          <FavoriteMenu />
        </Suspense>
      </div>
    </div>
  )
}
