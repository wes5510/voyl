import { css } from '../../../styled-system/css/index.mjs'
import { vstack } from '../../../styled-system/patterns/index.mjs'

export default function App(): JSX.Element {
  return (
    <div className={vstack({ gap: 0, h: 'full' })}>
      <div className={css({ h: 10, w: 'full' })}>Header</div>
      <div className={css({ flex: 1, w: 'full' })}>Body</div>
    </div>
  )
}
