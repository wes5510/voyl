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
import { useShallow } from 'zustand/react/shallow'

export interface PathStore {
  entity: PathEntity
}

const __usePathStore = create<PathStore>(() => ({
  entity: {
    points: [
      {
        icon: ListTree,
        text: 'Things',
        url: '/',
      },
      {
        icon: ListTree,
        text: '1',
        url: '/',
      },
      {
        text: '1-1',
        url: '/abc',
      },
      {
        text: '1-1-1',
        url: '/',
      },
    ],
  },
}))

const usePathStore = <T>(selector: (state: PathStore) => T) => __usePathStore(useShallow(selector))

export default usePathStore
export { getFirstPoint, getLastPoint, getMidPoint, getMidPoints, getMidPointLength }
