import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useMemoryStore = create(
  persist(
    (set) => ({
      memories: [],
      addMemory: (memory) => set((state) => ({
        memories: [memory, ...state.memories]
      })),
      updateMemory: (id, updates) => set((state) => ({
        memories: state.memories.map(memory =>
          memory.id === id ? { ...memory, ...updates } : memory
        )
      })),
      deleteMemory: (id) => set((state) => ({
        memories: state.memories.filter(memory => memory.id !== id)
      }))
    }),
    {
      name: 'memory-storage'
    }
  )
);

export default useMemoryStore;