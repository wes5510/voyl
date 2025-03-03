import { hstack } from '@/styled-system/patterns'
import PlusIcon from '@/common/PlusIcon'

export default function AddButton() {
  const handleClick = (): void => {
    // TODO: Append a new node to the tree
  }

  return (
    <button
      onClick={handleClick}
      className={hstack({
        width: 'fit-content',
        gap: 1,
        cursor: 'pointer',
        _hover: {
          fontWeight: 'semibold',
        },
        transitionProperty: 'font-weight',
        transitionDuration: 'fastest',
      })}
    >
      <PlusIcon width="20" height="20" />
      Add Thing
    </button>
  )
}
