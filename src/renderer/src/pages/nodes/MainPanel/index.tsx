import { vstack } from '@/styled-system/patterns'
import Scroller from './Scroller'
import Header from './Header'
import TreeView from './TreeView'

export default function MainPanel() {
  return (
    <Scroller>
      <div
        className={vstack({
          p: 6,
          gap: 6,
          alignItems: 'normal',
          overflowX: 'hidden',
        })}
      >
        <Header />
        <TreeView />
      </div>
    </Scroller>
  )
}
