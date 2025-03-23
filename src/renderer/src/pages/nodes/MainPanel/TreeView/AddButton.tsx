import PlusIcon from '@/common/PlusIcon'

export default function AddButton() {
  const handleClick = (): void => {
    // TODO: Append a new node to the tree
  }

  return (
    <button
      onClick={handleClick}
      className="flex w-fit cursor-pointer items-center gap-1 transition duration-75 hover:font-semibold"
    >
      <PlusIcon width="20" height="20" />
      Add Thing
    </button>
  )
}
