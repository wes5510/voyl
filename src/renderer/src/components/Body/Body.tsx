import { css } from '@styled-system/css'
import { hstack } from '@styled-system/patterns'
import { useState } from 'react'
import { MainPanel } from './MainPanel'

export default function Body(): JSX.Element {
  const [opened, setOpened] = useState<boolean>(false)

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
          bg: 'blue.500'
        })}
      >
        (Tester) Open Side Panel
      </button>
      <div className={css({ flex: 1, h: 'full' })}>
        <MainPanel />
      </div>
      <div
        className={css({
          w: '28rem',
          h: 'full',
          mr: opened ? '0' : '-28rem',
          transition: 'margin-right',
          transitionTimingFunction: 'ease-in-out',
          transitionDuration: 'normal'
        })}
      >
        <div
          className={css({
            h: 'full',
            borderLeftWidth: '1px',
            borderLeftColor: 'zinc.300',
            borderLeftStyle: 'solid'
          })}
        >
          Side Panel
        </div>
      </div>
    </div>
  )
}
