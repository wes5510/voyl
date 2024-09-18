import { hstack } from '@styled-system/patterns'
import FirstPointLink from './FirstPointLink'
import LastPointLink from './LastPointLink'
import MidPathSegment from './MidPathSegment'

export default function PathBlock(): JSX.Element {
  return (
    <div className={hstack({ gap: 1.5, fontSize: 'sm', color: 'zinc.600' })}>
      <FirstPointLink />
      <MidPathSegment />
      <LastPointLink />
    </div>
  )
}
