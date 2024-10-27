import { atom } from 'jotai'
import ListIcon from '../shared-components/Icon/ListIcon'
import {
  getFirstPoint,
  getLastPoint,
  getMidPoint,
  getMidPointLength,
  getMidPoints,
  PathModel,
} from '../model/path.model'

const pathAtom = atom<PathModel>({
  points: [
    {
      icon: ListIcon,
      text: 'Things',
      url: '/',
    },
  ],
})

export const firstPointAtom = atom((get) => getFirstPoint(get(pathAtom)))
export const lastPointAtom = atom((get) => getLastPoint(get(pathAtom)))
export const midPointsAtom = atom((get) => getMidPoints(get(pathAtom)))
export const midPointLengthAtom = atom((get) => getMidPointLength(get(pathAtom)))
export const midPointAtom = atom((get) => getMidPoint(get(pathAtom)))
