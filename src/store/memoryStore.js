import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const useMemoryStore = create((set, get) => ({
  memories: [],
  isLoading: false,
  error: null,
  
  fetchMemories: async () => {
    set({ isLoading: true });
    try {
      console.log('Fetching memories...');
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching memories:', error);
        throw error;
      }
      
      console.log('Fetched memories:', data);
      set({ memories: data || [], error: null });
    } catch (error) {
      console.error('Error in fetchMemories:', error);
      set({ error: error.message });
      toast.error('Failed to load memories');
    } finally {
      set({ isLoading: false });
    }
  },

  addMemory: async (memory) => {
    set({ isLoading: true });
    try {
      console.log('Adding memory:', memory);
      const { data: userData } = await supabase.auth.getUser();
      console.log('Current user:', userData);

      if (!userData.user) {
        throw new Error('You must be logged in to add a memory');
      }

      const newMemory = {
        ...memory,
        user_id: userData.user.id,
        user_email: userData.user.email
      };

      console.log('Inserting memory:', newMemory);
      const { data, error } = await supabase
        .from('memories')
        .insert([newMemory])
        .select()
        .single();

      if (error) {
        console.error('Error inserting memory:', error);
        throw error;
      }
      
      console.log('Added memory:', data);
      set((state) => ({
        memories: [...state.memories, data],
        error: null
      }));
      toast.success('Memory added successfully');
      return { success: true, data };
    } catch (error) {
      console.error('Error in addMemory:', error);
      set({ error: error.message });
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  updateMemory: async (id, updates) => {
    set({ isLoading: true });
    try {
      console.log('Updating memory:', id, updates);
      const { data: userData } = await supabase.auth.getUser();
      console.log('Current user:', userData);

      if (!userData.user) {
        throw new Error('You must be logged in to update a memory');
      }

      // First check if user owns the memory
      const { data: memoryData, error: fetchError } = await supabase
        .from('memories')
        .select('user_id')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching memory:', fetchError);
        throw fetchError;
      }

      if (memoryData.user_id !== userData.user.id) {
        throw new Error('You can only update your own memories');
      }

      console.log('Updating memory in database');
      const { data, error } = await supabase
        .from('memories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating memory:', error);
        throw error;
      }

      console.log('Updated memory:', data);
      set(state => ({
        memories: state.memories.map(memory => 
          memory.id === id ? { ...memory, ...updates } : memory
        ),
        error: null
      }));
      toast.success('Memory updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error in updateMemory:', error);
      set({ error: error.message });
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  deleteMemory: async (id) => {
    set({ isLoading: true });
    try {
      console.log('Deleting memory:', id);
      const { data: userData } = await supabase.auth.getUser();
      console.log('Current user:', userData);

      if (!userData.user) {
        throw new Error('You must be logged in to delete a memory');
      }

      // First check if user owns the memory
      const { data: memoryData, error: fetchError } = await supabase
        .from('memories')
        .select('user_id')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching memory:', fetchError);
        throw fetchError;
      }

      if (memoryData.user_id !== userData.user.id) {
        throw new Error('You can only delete your own memories');
      }

      console.log('Deleting memory from database');
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting memory:', error);
        throw error;
      }

      console.log('Memory deleted successfully');
      set(state => ({
        memories: state.memories.filter(memory => memory.id !== id),
        error: null
      }));
      toast.success('Memory deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error in deleteMemory:', error);
      set({ error: error.message });
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useMemoryStore;