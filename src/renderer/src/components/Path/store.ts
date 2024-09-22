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
}

const usePathStore = create<PathStore>((set) => ({
  points: [],
  set: (points): void => set({ points })
}))

export default usePathStore
