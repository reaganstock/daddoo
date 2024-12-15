import React, { useState } from 'react';
import AddFunFactModal from './AddFunFactModal';

const AddFunFactButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8" data-aos="fade-up">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center group"
        >
          <svg
            className="w-8 h-8 text-white/60 group-hover:text-white/90 transition-all duration-300 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="text-xl text-white/60 group-hover:text-white/90 transition-all duration-300">
            Add Fun Fact
          </span>
        </button>
      </div>

      <AddFunFactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default AddFunFactButton;