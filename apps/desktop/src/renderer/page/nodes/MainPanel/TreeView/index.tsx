import { useTreeViewNodes, useTopNodeId } from '@/renderer/store/treeView'
import TreeViewItem from './TreeViewItem'

export default function TreeView() {
  const topNodeId = useTopNodeId()
  const treeViewNodes = useTreeViewNodes({ topNodeId })

  return (
    <div className="items-normal flex flex-col gap-3">
      {treeViewNodes.map((node) => (
        <TreeViewItem
          key={node.nodeId}
          nodeId={node.nodeId}
          depth={node.depth}
        />
      ))}
    </div>
  )
}
