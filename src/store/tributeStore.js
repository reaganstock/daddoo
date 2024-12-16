import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

const useTributeStore = create(
  persist(
    (set) => ({
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
            .order('created_at', { ascending: true });

          if (error) throw error;
          set({ tributes: data || [], error: null });
        } catch (error) {
          console.error('Error fetching tributes:', error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      addTribute: async (tributeData) => {
        try {
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError || !user) {
            return { success: false, error: 'You must be logged in to add a tribute' };
          }

          const { id, title, content, audio_url, signature_url } = tributeData;
          const { data, error } = await supabase
            .from('tributes')
            .insert([
              {
                id,
                title,
                content,
                audio_url,
                signature_url,
                user_id: user.id,
                created_at: new Date().toISOString(),
              },
            ])
            .select();

          if (error) {
            console.error('Error adding tribute:', error);
            return { success: false, error: error.message };
          }

          // Update local state with the new tribute
          set((state) => ({
            tributes: [...state.tributes, data[0]],
          }));

          return { success: true, data: data[0] };
        } catch (error) {
          console.error('Error in addTribute:', error);
          return { success: false, error: error.message };
        }
      },

      updateTribute: async (id, updates) => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) {
            throw new Error('You must be logged in to update a tribute');
          }

          // Check if the user owns this tribute
          const { data: tributeData } = await supabase
            .from('tributes')
            .select('user_id')
            .eq('id', id)
            .single();

          if (!tributeData || tributeData.user_id !== userData.user.id) {
            throw new Error('You can only edit your own tributes');
          }

          // First update local state
          set(state => ({
            tributes: state.tributes.map(tribute =>
              tribute.id === id ? { ...tribute, ...updates } : tribute
            ),
            error: null
          }));

          // Then update database
          const { error } = await supabase
            .from('tributes')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', userData.user.id);

          if (error) throw error;
          return { success: true };
        } catch (error) {
          console.error('Error updating tribute:', error);
          return { success: false, error: error.message };
        }
      },

      deleteTribute: async (id) => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) {
            throw new Error('You must be logged in to delete a tribute');
          }

          // Delete from database first
          const { error } = await supabase
            .from('tributes')
            .delete()
            .eq('id', id)
            .eq('user_id', userData.user.id);

          if (error) throw error;

          // Then update local state
          set(state => ({
            tributes: state.tributes.filter(tribute => tribute.id !== id),
            error: null
          }));

          return { success: true };
        } catch (error) {
          console.error('Error deleting tribute:', error);
          return { success: false, error: error.message };
        }
      }
    }),
    {
      name: 'tribute-storage'
    }
  )
);

export default useTributeStore;