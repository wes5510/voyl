import { atom } from 'jotai'
import ListIcon from '../Icon/ListIcon'
import { getFirstPoint, getLastPoint, getMidPoints, PathModel } from './model'

const pathAtom = atom<PathModel>({
  points: [
    {
      icon: ListIcon,
      text: 'Things',
      url: '/'
    }
  ]
})

export const firstPointAtom = atom((get) => getFirstPoint(get(pathAtom)))
export const lastPointAtom = atom((get) => getLastPoint(get(pathAtom)))
export const midPointsAtom = atom((get) => getMidPoints(get(pathAtom)))
