import { ReactNode } from 'react'
import { create } from 'zustand'

export type Point = {
  icon?: ReactNode
  text: string
  url: string
}

interface PathStore {
  points: Point[]
  set(points: Point[]): void
  getFirstPoint(points: Point[]): Point | undefined
  getLastPoint(points: Point[]): Point | undefined
  getMidPoints(points: Point[]): Point[]
}

const usePathStore = create<PathStore>((set) => ({
  points: [],
  set: (points): void => set({ points }),
  getFirstPoint: (points: Point[]): Point | undefined => {
    return points.length > 0 ? points[0] : undefined
  },
  getLastPoint: (points: Point[]): Point | undefined => {
    return points.length > 1 ? points[points.length - 1] : undefined
  },
  getMidPoints: (points: Point[]): Point[] => {
    return points.length > 2 ? points.slice(1, points.length - 1) : []
  }
}))

export default usePathStore
