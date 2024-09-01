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
      <div className={css({ h: 10, w: 'full' })}>
        <Breadcrumb
          items={[
            {
              icon: <ListIcon width="16" height="16" />,
              text: 'Home',
              href: '/'
            },
            {
              icon: <ListIcon width="16" height="16" />,
              text: 'Things',
              href: '/things'
            }
          ]}
        />
      </div>
      <div className={css({ h: 10, w: 'full' })}>
        <Breadcrumb
          items={[
            {
              text: 'HomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHomeHome',
              href: '/'
            },
            {
              text: 'Things',
              href: '/things'
            },
            {
              text: 'Stuff',
              href: '/things/stuff'
            }
          ]}
        />
      </div>
      <div className={css({ h: 10, w: 'full' })}>
        <Breadcrumb
          items={[
            {
              text: 'Home',
              href: '/'
            },
            {
              text: 'Things',
              href: '/things'
            },
            {
              icon: <ListIcon width="16" height="16" />,
              text: 'Stuff1Stuff1Stuff1Stuff1Stuff1',
              href: '/things/stuff1'
            },
            {
              text: 'Stuff2',
              href: '/things/stuff2'
            },
            {
              text: 'Stuff3',
              href: '/things/stuff3'
            }
          ]}
        />
      </div>
      <div className={css({ flex: 1, w: 'full' })}>Body</div>
    </div>
  )
}
