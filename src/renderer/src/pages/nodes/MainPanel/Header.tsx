import { ListTree } from 'lucide-react'

export default function MainPanelHeader() {
  return (
    <div className="flex items-center gap-3">
      <ListTree className="h-9 w-9" />
      <span className="font-[roboto_mono,_monospace] text-3xl font-bold">Things</span>
    </div>
  )
}
