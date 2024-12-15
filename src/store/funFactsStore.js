import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFunFactsStore = create(
  persist(
    (set) => ({
      funFacts: [],
      addFunFact: (fact) => set((state) => ({ 
        funFacts: [...state.funFacts, { ...fact, id: Date.now() }] 
      })),
      updateFunFact: (id, updates) => set((state) => ({
        funFacts: state.funFacts.map(fact => 
          fact.id === id ? { ...fact, ...updates } : fact
        )
      })),
      deleteFunFact: (id) => set((state) => ({
        funFacts: state.funFacts.filter(fact => fact.id !== id)
      }))
    }),
    {
      name: 'fun-facts-storage'
    }
  )
);

export default useFunFactsStore;