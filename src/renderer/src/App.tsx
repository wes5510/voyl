import { css } from '../../../styled-system/css/index.mjs'
import { vstack } from '../../../styled-system/patterns/index.mjs'
import ListIcon from './components/icon/ListIcon'
import Breadcrumb from './components/Breadcrumb'

export default function App(): JSX.Element {
  return (
    <div className={vstack({ gap: 0, h: 'full' })}>
      <div className={css({ h: 10, w: 'full' })}>
        <Breadcrumb
          items={[
            {
              icon: <ListIcon width="16" height="16" />,
              text: 'Home',
              href: '/'
            }
          ]}
        />
      </div>
      <div className={css({ flex: 1, w: 'full' })}>Body</div>
    </div>
  )
}
