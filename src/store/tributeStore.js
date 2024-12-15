import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useTributeStore = create((set) => ({
  tributes: [],
  loading: false,
  error: null,

  fetchTributes: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('tributes')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ tributes: data || [], error: null });
    } catch (error) {
      console.error('Error fetching tributes:', error);
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  addTribute: async (tribute) => {
    set({ loading: true });
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('You must be logged in to add a tribute');
      }

      const newTribute = {
        title: tribute.title,
        content: tribute.content,
        user_id: userData.user.id,
        user_email: userData.user.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_deleted: false
      };
      
      const { data, error } = await supabase
        .from('tributes')
        .insert([newTribute])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ 
        tributes: [data, ...state.tributes],
        error: null 
      }));
    } catch (error) {
      console.error('Error adding tribute:', error);
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updateTribute: async (id, updates) => {
    set({ loading: true });
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('You must be logged in to update a tribute');
      }

      const { data, error } = await supabase
        .from('tributes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_email', userData.user.email)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        tributes: state.tributes.map(tribute =>
          tribute.id === id ? data : tribute
        ),
        error: null
      }));
    } catch (error) {
      console.error('Error updating tribute:', error);
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteTribute: async (id) => {
    set({ loading: true });
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('You must be logged in to delete a tribute');
      }

      const { error } = await supabase
        .from('tributes')
        .update({ is_deleted: true })
        .eq('id', id)
        .eq('user_email', userData.user.email);

      if (error) throw error;
      set(state => ({
        tributes: state.tributes.filter(tribute => tribute.id !== id),
        error: null
      }));
    } catch (error) {
      console.error('Error deleting tribute:', error);
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  }
}));

export default useTributeStore;