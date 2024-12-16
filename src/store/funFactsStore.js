import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultFacts = [
  {
    id: 'football',
    title: 'Football Commentary',
    content: 'Master of creative player identification, turning every AJ Brown play into a "Cook" highlight!',
    image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/4047646.png'
  },
  {
    id: 'heroes',
    title: 'Heroes Legacy',
    content: 'These are the legends you\'ve always looked up to. The ones who shaped your love for the game, your values, and your spirit.',
    image: 'https://imgur.com/uzVxhSh.jpg'
  }
];

const useFunFactsStore = create(
  persist(
    (set) => ({
      funFacts: defaultFacts,
      isLoading: true,
      addFunFact: (newFunFact) =>
        set((state) => ({
          funFacts: [...state.funFacts, newFunFact],
          isLoading: false,
        })),
      updateFunFact: (id, updates) => {
        const isDefaultFact = defaultFacts.some(fact => fact.id === id);
        if (isDefaultFact) return;

        set((state) => ({
          funFacts: state.funFacts.map((fact) =>
            fact.id === id ? { ...fact, ...updates } : fact
          )
        }));
      },
      deleteFunFact: (id) => {
        const isDefaultFact = defaultFacts.some(fact => fact.id === id);
        if (isDefaultFact) return;

        set((state) => ({
          funFacts: state.funFacts.filter((fact) => fact.id !== id)
        }));
      }
    }),
    {
      name: 'fun-facts-storage',
      version: 2
    }
  )
);

export default useFunFactsStore;