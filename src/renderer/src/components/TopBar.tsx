import { useEffect } from 'react'
import { PathBlock, usePathStore } from './Path'
import ListIcon from './Icon/ListIcon'
import { hstack } from '@styled-system/patterns'

export default function TopBar(): JSX.Element {
  const setPath = usePathStore((store) => store.set)

  useEffect(() => {
    setPath([
      {
        icon: <ListIcon width="16" height="16" />,
        text: 'Things',
        url: '/'
      }
    ])
  }, [setPath])

  return (
    <div
      className={hstack({
        paddingStart: 2.5,
        h: 10,
        w: 'full',
        borderBottomWidth: '1px',
        borderBottomColor: 'black/50',
        justify: 'space-between'
      })}
    >
      <PathBlock />
    </div>
  )
}
