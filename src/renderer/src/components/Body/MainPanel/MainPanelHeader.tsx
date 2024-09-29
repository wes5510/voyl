import Header from './Header'
import useMainPanelStore from './store'

export default function MainPanelHeader(): JSX.Element {
  const title = useMainPanelStore((state) => state.title)

  return <Header text={title?.text ?? ''} icon={title?.icon} />
}
