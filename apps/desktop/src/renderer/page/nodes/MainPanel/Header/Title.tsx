import { useTreeNodeTitle } from '@/renderer/state/tree'
import { useTopNodeId } from '@/renderer/state/treeView'

export default function Title() {
  const topNodeId = useTopNodeId()
  const title = useTreeNodeTitle({ nodeId: topNodeId })

  return (
    <span className="font-[roboto_mono,_monospace] text-3xl font-bold">
      {title}
    </span>
  )
}
