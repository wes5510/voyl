import { css } from '@styled-system/css'

export default function Divider(): JSX.Element {
  return (
    <div
      className={css({
        paddingX: 2,
        width: 'full',
        height: '0.5px'
      })}
    >
      <div
        className={css({
          bg: 'zinc.300',
          width: 'full',
          height: 'full'
        })}
      />
    </div>
  )
}
