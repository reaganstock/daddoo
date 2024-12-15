import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { usePreviewStore } from '../store/previewStore';
import LoginModal from './Auth/LoginModal';

const Header = () => {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const clearAccess = usePreviewStore((state) => state.clearAccess);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearAccess(); // Clear preview access when logging out
    window.location.href = '/';
  };

  return (
    <header className="bg-transparent py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Dad's Birthday</h1>
        <nav className="flex items-center space-x-4">
          {user ? (
            <button
              onClick={handleSignOut}
              className="text-white hover:text-indigo-300 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-white hover:text-indigo-300 transition-colors"
            >
              Sign In to Contribute
            </button>
          )}
          <button
            onClick={() => {
              clearAccess();
              window.location.href = '/';
            }}
            className="text-white hover:text-red-300 transition-colors"
          >
            Exit Preview
          </button>
        </nav>
      </div>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </header>
  );
};

export default Header;
