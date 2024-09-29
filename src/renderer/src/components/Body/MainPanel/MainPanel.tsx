import { vstack } from '@styled-system/patterns'
import MainPanelHeader from './MainPanelHeader'
import MainPanelBody from './MainPanelBody'
import Scroller from './Scroller'

export default function MainPanel(): JSX.Element {
  return (
    <Scroller>
      <div
        className={vstack({
          p: 6,
          gap: 6,
          alignItems: 'normal'
        })}
      >
        <MainPanelHeader />
        <MainPanelBody />
      </div>
    </Scroller>
  )
}
