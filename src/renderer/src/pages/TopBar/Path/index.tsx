import FirstPointLink from './FirstPointLink'
import LastPointLink from './LastPointLink'
import MidPathSegment from './MidPathSegment'

export default function Path() {
  return (
    <div className="flex items-center gap-1.5 text-sm text-zinc-600">
      <FirstPointLink />
      <MidPathSegment />
      <LastPointLink />
    </div>
  )
}
