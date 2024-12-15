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
            .eq('is_deleted', false)
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ memories: data || [], loading: false, error: null });
        } catch (error) {
          console.error('Error fetching memories:', error);
          set({ error: error.message, loading: false });
        }
      },
      addMemory: async (memory) => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) {
            throw new Error('You must be logged in to add a memory');
          }

          const newMemory = {
            title: memory.title,
            content: memory.content,
            image_url: memory.image_url,
            user_id: userData.user.id,
            user_email: userData.user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_deleted: false
          };
          
          const { data, error } = await supabase
            .from('memories')
            .insert([newMemory])
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            memories: [data, ...state.memories]
          }));
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

          // First check if the user owns this memory
          const { data: memoryData, error: fetchError } = await supabase
            .from('memories')
            .select('user_email')
            .eq('id', id)
            .single();

          if (fetchError) throw fetchError;

          if (memoryData.user_email !== userData.user.email) {
            throw new Error('You do not have permission to update this memory');
          }

          const { data, error } = await supabase
            .from('memories')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            memories: state.memories.map(memory =>
              memory.id === id ? { ...memory, ...data } : memory
            )
          }));
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

          // First check if the user owns this memory
          const { data: memoryData, error: fetchError } = await supabase
            .from('memories')
            .select('user_email')
            .eq('id', id)
            .single();

          if (fetchError) throw fetchError;

          if (memoryData.user_email !== userData.user.email) {
            throw new Error('You do not have permission to delete this memory');
          }

          const { error } = await supabase
            .from('memories')
            .update({ 
              is_deleted: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            memories: state.memories.filter(memory => memory.id !== id)
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