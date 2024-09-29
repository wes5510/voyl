import { vstack } from '@styled-system/patterns'
import AddTreeViewItemButton from './AddTreeViewItemButton'
import { TreeViewItem } from './TreeViewItem'

export default function TreeView(): JSX.Element {
  return (
    <div className={vstack({ gap: 3, alignItems: 'normal' })}>
      <TreeViewItem />
      <TreeViewItem />
      <AddTreeViewItemButton />
    </div>
  )
}
