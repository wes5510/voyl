import { useState, memo } from 'react'
import MainPanel from './MainPanel'
import useTreeView from './useTreeView'

const MMainPanel = memo(MainPanel)

export default function NodesPage() {
  const [opened, setOpened] = useState<boolean>(false)
  useTreeView()

  const handleClick = (): void => {
    setOpened((prev) => !prev)
  }

  return (
    <div className="flex h-full w-full flex-row gap-0 overflow-x-hidden">
      <button onClick={handleClick} className="absolute bottom-0 z-[100] bg-blue-500">
        (Tester) Open Side Panel
      </button>
      <div className="h-full flex-1">
        <MMainPanel />
      </div>
      <div
        className={`h-full w-[28rem] ${opened ? 'mr-0' : '-mr-[28rem]'} transition-[margin-right] duration-300 ease-in-out`}
      >
        <div className="h-full border-l border-l-zinc-300">Side Panel</div>
      </div>
    </div>
  )
}
