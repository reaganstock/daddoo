import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

const useFunFactsStore = create(
  persist(
    (set) => ({
      funFacts: [],
      loading: false,
      error: null,

      fetchFunFacts: async () => {
        set({ loading: true });
        try {
          const { data, error } = await supabase
            .from('fun_facts')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ funFacts: data || [], error: null });
        } catch (error) {
          console.error('Error fetching fun facts:', error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      addFunFact: async (fact) => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) {
            throw new Error('You must be logged in to add a fun fact');
          }

          const newFact = {
            ...fact,
            user_id: userData.user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          // First update local state
          set(state => ({ 
            funFacts: [newFact, ...state.funFacts],
            error: null 
          }));

          // Then update database
          const { error } = await supabase
            .from('fun_facts')
            .insert([newFact]);

          if (error) throw error;
          return { success: true };
        } catch (error) {
          console.error('Error adding fun fact:', error);
          return { success: false, error: error.message };
        }
      },

      updateFunFact: async (id, updates) => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) {
            throw new Error('You must be logged in to update a fun fact');
          }

          // First update local state
          set(state => ({
            funFacts: state.funFacts.map(fact =>
              fact.id === id ? { ...fact, ...updates } : fact
            ),
            error: null
          }));

          // Then update database
          const { error } = await supabase
            .from('fun_facts')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', userData.user.id);

          if (error) throw error;
          return { success: true };
        } catch (error) {
          console.error('Error updating fun fact:', error);
          return { success: false, error: error.message };
        }
      },

      deleteFunFact: async (id) => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) {
            throw new Error('You must be logged in to delete a fun fact');
          }

          // Delete from database first
          const { error } = await supabase
            .from('fun_facts')
            .delete()
            .eq('id', id)
            .eq('user_id', userData.user.id);

          if (error) throw error;

          // Then update local state
          set(state => ({
            funFacts: state.funFacts.filter(fact => fact.id !== id),
            error: null
          }));

          return { success: true };
        } catch (error) {
          console.error('Error deleting fun fact:', error);
          return { success: false, error: error.message };
        }
      }
    }),
    {
      name: 'fun-facts-storage'
    }
  )
);

export default useFunFactsStore;