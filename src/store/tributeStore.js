import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const useTributeStore = create((set, get) => ({
  tributes: [],
  isLoading: false,
  error: null,
  
  fetchTributes: async () => {
    set({ isLoading: true });
    try {
      console.log('Fetching tributes...');
      const { data, error } = await supabase
        .from('tributes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tributes:', error);
        throw error;
      }
      
      console.log('Fetched tributes:', data);
      set({ tributes: data || [], error: null });
    } catch (error) {
      console.error('Error in fetchTributes:', error);
      set({ error: error.message });
      toast.error('Failed to load tributes');
    } finally {
      set({ isLoading: false });
    }
  },

  addTribute: async (tribute) => {
    set({ isLoading: true });
    try {
      console.log('Adding tribute:', tribute);
      const { data: userData } = await supabase.auth.getUser();
      console.log('Current user:', userData);

      if (!userData.user) {
        throw new Error('You must be logged in to add a tribute');
      }

      const newTribute = {
        ...tribute,
        user_id: userData.user.id,
        user_email: userData.user.email
      };

      console.log('Inserting tribute:', newTribute);
      const { data, error } = await supabase
        .from('tributes')
        .insert([newTribute])
        .select()
        .single();

      if (error) {
        console.error('Error inserting tribute:', error);
        throw error;
      }
      
      console.log('Added tribute:', data);
      set((state) => ({
        tributes: [...state.tributes, data],
        error: null
      }));
      toast.success('Tribute added successfully');
      return { success: true, data };
    } catch (error) {
      console.error('Error in addTribute:', error);
      set({ error: error.message });
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  updateTribute: async (id, updates) => {
    set({ isLoading: true });
    try {
      console.log('Updating tribute:', id, updates);
      const { data: userData } = await supabase.auth.getUser();
      console.log('Current user:', userData);

      if (!userData.user) {
        throw new Error('You must be logged in to update a tribute');
      }

      // First check if user owns the tribute
      const { data: tributeData, error: fetchError } = await supabase
        .from('tributes')
        .select('user_id')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching tribute:', fetchError);
        throw fetchError;
      }

      if (tributeData.user_id !== userData.user.id) {
        throw new Error('You can only update your own tributes');
      }

      console.log('Updating tribute in database');
      const { data, error } = await supabase
        .from('tributes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating tribute:', error);
        throw error;
      }

      console.log('Updated tribute:', data);
      set(state => ({
        tributes: state.tributes.map(tribute => 
          tribute.id === id ? { ...tribute, ...updates } : tribute
        ),
        error: null
      }));
      toast.success('Tribute updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error in updateTribute:', error);
      set({ error: error.message });
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTribute: async (id) => {
    set({ isLoading: true });
    try {
      console.log('Deleting tribute:', id);
      const { data: userData } = await supabase.auth.getUser();
      console.log('Current user:', userData);

      if (!userData.user) {
        throw new Error('You must be logged in to delete a tribute');
      }

      // First check if user owns the tribute
      const { data: tributeData, error: fetchError } = await supabase
        .from('tributes')
        .select('user_id')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching tribute:', fetchError);
        throw fetchError;
      }

      if (tributeData.user_id !== userData.user.id) {
        throw new Error('You can only delete your own tributes');
      }

      console.log('Deleting tribute from database');
      const { error } = await supabase
        .from('tributes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting tribute:', error);
        throw error;
      }

      console.log('Tribute deleted successfully');
      set(state => ({
        tributes: state.tributes.filter(tribute => tribute.id !== id),
        error: null
      }));
      toast.success('Tribute deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error in deleteTribute:', error);
      set({ error: error.message });
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useTributeStore;