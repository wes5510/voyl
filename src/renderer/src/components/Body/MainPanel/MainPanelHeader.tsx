import { css } from '@styled-system/css'
import { hstack } from '@styled-system/patterns'
import { titleAtom } from './store'
import { useAtomValue } from 'jotai'

export default function MainPanelHeader(): JSX.Element {
  const { icon: Icon, text } = useAtomValue(titleAtom)

  return (
    <div
      className={hstack({
        gap: 3
      })}
    >
      {Icon && (
        <Icon
          className={css({
            width: 9,
            height: 9
          })}
        />
      )}
      <span
        className={css({
          fontSize: '3xl',
          fontWeight: 'bold',
          fontFamily: 'roboto mono, monospace'
        })}
      >
        {text}
      </span>
    </div>
  )
}
