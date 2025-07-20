import Header from './Header'
import TreeView from './TreeView'
import { ScrollArea } from '@/renderer/common/ScrollArea'

export default function MainPanel() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="items-normal flex flex-col gap-6 overflow-x-hidden p-6">
        <Header />
        <TreeView />
      </div>
    </ScrollArea>
  )
}
