import { vstack } from '@/styled-system/patterns'
import { useAtomValue } from 'jotai'
import TreeViewItem from './TreeViewItem'
import { memo } from 'react'
import AddButton from './AddButton'
import { nodeIdsAtom } from '@/state/tree.state'

const MTreeViewItem = memo(TreeViewItem)

export default function TreeView(): JSX.Element {
  const nodeIds = useAtomValue(nodeIdsAtom)

  return (
    <div className={vstack({ gap: 3, alignItems: 'normal' })}>
      {nodeIds.map((id) => (
        <MTreeViewItem key={id} nodeId={id} />
      ))}
      <AddButton />
    </div>
  )
}
