import { vstack } from '@styled-system/patterns'
import AddTreeViewItemButton from './AddTreeViewItemButton'
import { TreeViewItem } from './TreeViewItem'
import { useEffect } from 'react'
import useTreeStore from './store'

const NODES = [
  {
    id: '1',
    text: '1',
    collapsed: false
  }
]

const TREE = [
  {
    id: '1',
    depth: 0
  }
]

function NodeItem({ id }: { id: string }): JSX.Element | undefined {
  const { node, setNodeText, toggleCollapsed } = useTreeStore((store) => ({
    node: store.nodeMap.get(id),
    setNodeText: store.setNodeText,
    toggleCollapsed: store.toggleCollapsed
  }))

  const handleChangeText = (text: string): void => {
    setNodeText({
      id,
      text
    })
  }

  const handleClickCollapseButton = (): void => {
    toggleCollapsed(id)
  }

  return (
    node && (
      <TreeViewItem
        collapsed={node.collapsed}
        initialText={node.text}
        onClickCollapseButton={handleClickCollapseButton}
        onChangeText={handleChangeText}
      />
    )
  )
}

export default function TreeView(): JSX.Element {
  const setNodes = useTreeStore((store) => store.setNodes)

  useEffect(() => {
    setNodes(NODES)
  }, [setNodes])

  return (
    <div className={vstack({ gap: 3, alignItems: 'normal' })}>
      {TREE.map(({ id }) => (
        <NodeItem key={id} id={id} />
      ))}
      <AddTreeViewItemButton />
    </div>
  )
}
