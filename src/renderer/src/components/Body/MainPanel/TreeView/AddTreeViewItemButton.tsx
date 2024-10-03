import AddButton from './AddButton'

export default function AddTreeViewItemButton(): JSX.Element {
  const handleClick = (): void => {
    // TODO: Append a new node to the tree
  }
  return <AddButton text="Add Thing" onClick={handleClick} />
}
