import Divider from './Divider'
import FavoriteMenu from './FavoriteMenu'
import AppMenu from './AppMenu'

export default function SideBar() {
  return (
    <div className="flex h-full flex-col justify-between border-r border-black/50">
      <div className="flex flex-col gap-0">
        <AppMenu />
        <Divider />
        <FavoriteMenu />
      </div>
    </div>
  )
}
