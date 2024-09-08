import ListIcon from './components/icon/ListIcon'
import Breadcrumb from './components/Breadcrumb'
import IconButton from './components/IconButton'
import { hstack, vstack } from '@styled-system/patterns'
import { css } from '@styled-system/css'

export default function App(): JSX.Element {
  return (
    <div className={vstack({ gap: 0, h: 'full' })}>
      <div
        className={hstack({
          paddingStart: 2.5,
          h: 10,
          w: 'full',
          borderBottomWidth: '1px',
          borderBottomColor: 'black',
          justify: 'space-between'
        })}
      >
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
      <div className={hstack({ flex: 1, w: 'full', gap: 0 })}>
        <div
          className={vstack({
            h: 'full',
            borderRightWidth: '1px',
            borderRightColor: 'black',
            justify: 'space-between'
          })}
        >
          <div className={vstack({ gap: 0 })}>
            <IconButton active icon={<ListIcon />} />
            <IconButton icon={<ListIcon />} />
          </div>
        </div>
        <div className={css({ flex: 1 })}>Main</div>
      </div>
    </div>
  )
}
