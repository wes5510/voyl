import { css } from '@/styled-system/css'
import { hstack } from '@/styled-system/patterns'
import ListIcon from '@/common/ListIcon'

export default function MainPanelHeader() {
  return (
    <div
      className={hstack({
        gap: 3,
      })}
    >
      <ListIcon
        className={css({
          width: 9,
          height: 9,
        })}
      />
      <span
        className={css({
          fontSize: '3xl',
          fontWeight: 'bold',
          fontFamily: 'roboto mono, monospace',
        })}
      >
        Things
      </span>
    </div>
  )
}
