import { create } from 'zustand'
import {
  PathEntity,
  getFirstPoint,
  getLastPoint,
  getMidPoint,
  getMidPoints,
  getMidPointLength,
} from '.'
import { ListTree } from 'lucide-react'

const usePathStore = create<PathEntity>(() => ({
  points: [
    {
      icon: ListTree,
      text: 'Things',
      url: '/',
    },
  ],
}))

export default usePathStore
export { getFirstPoint, getLastPoint, getMidPoint, getMidPoints, getMidPointLength }
