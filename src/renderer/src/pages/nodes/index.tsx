import { css } from '@/styled-system/css'
import { hstack } from '@/styled-system/patterns'
import { useState , memo } from 'react'
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
    <div className={hstack({ w: 'full', h: 'full', gap: 0, overflowX: 'hidden' })}>
      <button
        onClick={handleClick}
        className={css({
          zIndex: 100,
          position: 'absolute',
          bottom: 0,
          bg: 'blue.500',
        })}
      >
        (Tester) Open Side Panel
      </button>
      <div className={css({ flex: 1, h: 'full' })}>
        <MMainPanel />
      </div>
      <div
        className={css({
          w: '28rem',
          h: 'full',
          mr: opened ? '0' : '-28rem',
          transition: 'margin-right',
          transitionTimingFunction: 'ease-in-out',
          transitionDuration: 'normal',
        })}
      >
        <div
          className={css({
            h: 'full',
            borderLeftWidth: '1px',
            borderLeftColor: 'zinc.300',
            borderLeftStyle: 'solid',
          })}
        >
          Side Panel
        </div>
      </div>
    </div>
  )
}
