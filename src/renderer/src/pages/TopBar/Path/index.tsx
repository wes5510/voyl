import Breadcrumb from '@/common/Breadcrumb'
import FirstPointLink from './FirstPointLink'
import LastPointLink from './LastPointLink'
import MidPathSegment from './MidPathSegment'
import BreadcrumbList from '@/common/BreadcrumbList'

export default function Path() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <FirstPointLink />
        <MidPathSegment />
        <LastPointLink />
      </BreadcrumbList>
    </Breadcrumb>
  )
}
