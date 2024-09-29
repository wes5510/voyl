import { ElementType } from 'react'
import { create } from 'zustand'

export type Title = {
  icon?: ElementType
  text: string
}

interface MainPanelStore {
  title?: Title
  setTitle(title: Title): void
}

const useMainPanelStore = create<MainPanelStore>((set) => ({
  title: undefined,
  setTitle: (title): void => set({ title })
}))

export default useMainPanelStore
