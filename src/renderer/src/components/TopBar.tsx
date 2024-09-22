import { PathBlock } from './Path'
import { hstack } from '@styled-system/patterns'

export default function TopBar(): JSX.Element {
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
