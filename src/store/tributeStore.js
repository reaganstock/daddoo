import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTributeStore = create(
  persist(
    (set) => ({
      tributes: [],
      addTribute: (tribute) => set((state) => ({ 
        tributes: [tribute, ...state.tributes]
      })),
      updateTribute: (id, updates) => set((state) => ({
        tributes: state.tributes.map(tribute =>
          tribute.id === id ? { ...tribute, ...updates } : tribute
        )
      })),
      deleteTribute: (id) => set((state) => ({
        tributes: state.tributes.filter(tribute => tribute.id !== id)
      }))
    }),
    {
      name: 'tribute-storage'
    }
  )
);

export default useTributeStore;