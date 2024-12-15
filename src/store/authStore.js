import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      session: null,
      loading: true,
      signIn: async (provider) => {
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo: window.location.origin + '/tribute'
            }
          });
          if (error) throw error;
        } catch (error) {
          console.error('Error signing in:', error.message);
        }
      },
      signOut: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, session: null });
          window.location.href = '/';
        } catch (error) {
          console.error('Error signing out:', error.message);
        }
      },
      initialize: async () => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;
          
          set({ 
            session,
            user: session?.user ?? null,
            loading: false
          });

          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            set({ 
              session,
              user: session?.user ?? null
            });
          });

          return () => subscription.unsubscribe();
        } catch (error) {
          console.error('Error initializing auth:', error.message);
          set({ loading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage
    }
  )
);

export default useAuthStore;