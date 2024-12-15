import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface FunFact {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
}

interface FunFactStore {
  funFacts: FunFact[];
  loading: boolean;
  error: string | null;
  editingFunFact: FunFact | null;
  fetchFunFacts: () => Promise<void>;
  addFunFact: (funFact: Omit<FunFact, 'id' | 'created_at'>) => Promise<void>;
  updateFunFact: (id: string, updates: Partial<FunFact>) => Promise<void>;
  deleteFunFact: (id: string) => Promise<void>;
  setEditingFunFact: (funFact: FunFact | null) => void;
}

const useFunFactStore = create<FunFactStore>((set, get) => ({
  funFacts: [],
  loading: false,
  error: null,
  editingFunFact: null,

  fetchFunFacts: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('fun_facts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ funFacts: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addFunFact: async (funFact) => {
    try {
      const { data, error } = await supabase
        .from('fun_facts')
        .insert([funFact])
        .select()
        .single();

      if (error) throw error;
      
      set((state) => ({
        funFacts: [data, ...state.funFacts]
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateFunFact: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('fun_facts')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        funFacts: state.funFacts.map((fact) =>
          fact.id === id ? { ...fact, ...updates } : fact
        ),
        editingFunFact: null
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteFunFact: async (id) => {
    try {
      const { error } = await supabase
        .from('fun_facts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        funFacts: state.funFacts.filter((fact) => fact.id !== id)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  setEditingFunFact: (funFact) => {
    set({ editingFunFact: funFact });
  }
}));

export default useFunFactStore;
