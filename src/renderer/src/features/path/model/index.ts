import { create } from 'zustand'
import {
  PathEntity,
  getFirstPoint,
  getLastPoint,
  getMidPoint,
  getMidPoints,
  getMidPointLength,
} from './path'
import ListIcon from '@/common/ListIcon'

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
export { getFirstPoint, getLastPoint, getMidPoint, getMidPoints, getMidPointLength }
