import { create } from 'zustand'
import { PathEntity } from './path'
import ListIcon from '@/shared/ListIcon'

const usePathStore = create<PathEntity>(() => ({
  points: [
    {
      icon: ListIcon,
      text: 'Things',
      url: '/',
    },
  ],
}))

export default usePathStore
