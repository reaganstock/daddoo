import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

const useMemoryStore = create(
  persist(
    (set) => ({
      memories: [],
      loading: false,
      error: null,

      fetchMemories: async () => {
        set({ loading: true });
        try {
          const { data, error } = await supabase
            .from('memories')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ memories: data || [], error: null });
        } catch (error) {
          console.error('Error fetching memories:', error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      addMemory: async (memory) => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) {
            throw new Error('You must be logged in to add a memory');
          }

          const newMemory = {
            ...memory,
            user_id: userData.user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          // First update local state
          set(state => ({ 
            memories: [newMemory, ...state.memories],
            error: null 
          }));

          // Then update database
          const { error } = await supabase
            .from('memories')
            .insert([newMemory]);

          if (error) throw error;
          return { success: true };
        } catch (error) {
          console.error('Error adding memory:', error);
          return { success: false, error: error.message };
        }
      },

      updateMemory: async (id, updates) => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) {
            throw new Error('You must be logged in to update a memory');
          }

          // First update local state
          set(state => ({
            memories: state.memories.map(memory =>
              memory.id === id ? { ...memory, ...updates } : memory
            ),
            error: null
          }));

          // Then update database
          const { error } = await supabase
            .from('memories')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', userData.user.id);

          if (error) throw error;
          return { success: true };
        } catch (error) {
          console.error('Error updating memory:', error);
          return { success: false, error: error.message };
        }
      },

      deleteMemory: async (id) => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) {
            throw new Error('You must be logged in to delete a memory');
          }

          // Delete from database first
          const { error } = await supabase
            .from('memories')
            .delete()
            .eq('id', id)
            .eq('user_id', userData.user.id);

          if (error) throw error;

          // Then update local state
          set(state => ({
            memories: state.memories.filter(memory => memory.id !== id),
            error: null
          }));

          return { success: true };
        } catch (error) {
          console.error('Error deleting memory:', error);
          return { success: false, error: error.message };
        }
      }
    }),
    {
      name: 'memory-storage'
    }
  )
);

export default useMemoryStore;