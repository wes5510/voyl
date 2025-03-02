import { css } from '@/styled-system/css'
import CircleIcon from '@/common/CircleIcon'

export default function DotIcon(): JSX.Element {
  return (
    <CircleIcon
      className={css({
        w: 1.5,
        h: 1.5,
        alignSelf: 'center',
      })}
    />
  )
}
