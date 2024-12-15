import React, { useState } from 'react';
import { LoginModal } from '../Auth/LoginModal';
import { useAuthStore } from '../../store/authStore';

const LandingPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user } = useAuthStore();

  const handleEnterClick = () => {
    if (user) {
      window.location.href = '/celebration';
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-purple-900 to-blue-900 text-white p-4">
      <h1 className="text-5xl md:text-7xl font-bold mb-8 text-center">
        Happy Birthday Dad!
      </h1>
      <p className="text-xl md:text-2xl mb-12 text-center max-w-2xl">
        Welcome to a special celebration dedicated to an amazing father.
      </p>
      <button
        onClick={handleEnterClick}
        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xl font-semibold transition-colors duration-200 transform hover:scale-105"
      >
        Enter Celebration
      </button>
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onRequestClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
