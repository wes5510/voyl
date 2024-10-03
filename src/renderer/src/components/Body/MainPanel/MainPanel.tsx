import { vstack } from '@styled-system/patterns'
import MainPanelBody from './MainPanelBody'
import Scroller from './Scroller'
import MainPanelHeader from './MainPanelHeader'

export default function MainPanel(): JSX.Element {
  return (
    <Scroller>
      <div
        className={vstack({
          p: 6,
          gap: 6,
          alignItems: 'normal',
          overflowX: 'hidden'
        })}
      >
        <MainPanelHeader />
        <MainPanelBody />
      </div>
    </Scroller>
  )
}
