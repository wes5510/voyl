import Scroller from './Scroller'
import Header from './Header'
import TreeView from './TreeView'

export default function MainPanel() {
  return (
    <Scroller>
      <div className="items-normal flex flex-col gap-6 overflow-x-hidden p-6">
        <Header />
        <TreeView />
      </div>
    </Scroller>
  )
}
