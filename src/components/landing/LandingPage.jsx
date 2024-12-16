import React, { useState } from 'react';
import LoginModal from '../auth/LoginModal.tsx';

const LandingPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleEnter = () => {
    setIsLoginModalOpen(true);
  };

  const handlePreview = () => {
    window.location.href = '/preview';
  };

  const handleLoginSuccess = () => {
    window.location.href = '/celebration';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-blue-900 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-5xl mx-auto">
        <div className="mb-12">
          <img 
            src="https://imgur.com/tZxj4mz.jpg" 
            alt="Trey Stock" 
            className="w-48 h-48 md:w-64 md:h-64 rounded-full mx-auto object-cover border-4 border-purple-400/50"
          />
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Celebrating the Great Historic Life of Trey Stock
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12">
          Join us in celebrating his birthday - a day filled with memories, laughter, and love.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleEnter}
            className="px-8 py-4 bg-purple-600 text-xl text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Enter Celebration
          </button>
          <button
            onClick={handlePreview}
            className="px-8 py-4 bg-indigo-600 text-xl text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            See Preview
          </button>
        </div>
        <LoginModal
          isOpen={isLoginModalOpen}
          onRequestClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </div>
  );
};

export default LandingPage;