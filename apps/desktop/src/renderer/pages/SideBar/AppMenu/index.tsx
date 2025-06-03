import IconButton from './IconButton'
import { ListTree } from 'lucide-react'

export default function AppMenu() {
  return <IconButton icon={<ListTree className="h-5 w-5" />} text="things" />
}
