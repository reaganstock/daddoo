import React, { useState } from 'react';
import AddTributeModal from './AddTributeModal';

const AddTributeButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8 flex items-center justify-center group hover:bg-white/20 transition-all duration-300"
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
          Add Tribute
        </span>
      </button>
      <AddTributeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default AddTributeButton;