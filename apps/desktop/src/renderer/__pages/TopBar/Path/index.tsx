import FirstPointLink from './FirstPointLink'
import LastPointLink from './LastPointLink'
import MidPathSegment from './MidPathSegment'
import Breadcrumb from './Breadcrumb'

export default function Path() {
  return (
    <Breadcrumb>
      <FirstPointLink />
      <MidPathSegment />
      <LastPointLink />
    </Breadcrumb>
  )
}
