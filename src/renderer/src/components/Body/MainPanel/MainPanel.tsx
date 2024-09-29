import { vstack } from '@styled-system/patterns'
import MainPanelHeader from './MainPanelHeader'
import MainPanelBody from './MainPanelBody'
import Scroller from './Scroller'
import useMainPanelStore from './store'
import { useEffect } from 'react'
import ListIcon from '../../Icon/ListIcon'

export default function MainPanel(): JSX.Element {
  const setTitle = useMainPanelStore((state) => state.setTitle)

  useEffect(
    function TEMP_setTitle() {
      setTitle({
        text: 'Things',
        icon: ListIcon
      })
    },
    [setTitle]
  )

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
