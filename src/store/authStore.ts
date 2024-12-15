import { create } from 'zustand'
import { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
}))

export { useAuthStore }
