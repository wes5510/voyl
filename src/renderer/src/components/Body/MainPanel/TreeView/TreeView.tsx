import { vstack } from '@styled-system/patterns'
import AddTreeViewItemButton from './AddTreeViewItemButton'
import { nodeIdsAtom } from './store'
import { useAtomValue } from 'jotai'
import { TreeViewItem } from './TreeViewItem'
import { memo } from 'react'

const MTreeViewItem = memo(TreeViewItem)

export default function TreeView(): JSX.Element {
  const nodeIds = useAtomValue(nodeIdsAtom)

  return (
    <div className={vstack({ gap: 3, alignItems: 'normal' })}>
      {nodeIds.map((id) => (
        <MTreeViewItem key={id} nodeId={id} />
      ))}
      <AddTreeViewItemButton />
    </div>
  )
}
