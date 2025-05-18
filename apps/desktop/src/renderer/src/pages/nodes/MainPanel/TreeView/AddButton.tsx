import { Plus } from 'lucide-react'

export default function AddButton() {
  const handleClick = (): void => {
    // TODO: Append a new node to the tree
  }

  return (
    <button
      onClick={handleClick}
      className="flex w-fit cursor-pointer items-center gap-1 transition duration-75 hover:font-semibold"
    >
      <Plus className="h-5 w-5 stroke-[1.5]" />
      Add Thing
    </button>
  )
}
