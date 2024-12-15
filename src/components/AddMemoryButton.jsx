import React, { useState } from 'react';
import AddMemoryModal from './AddMemoryModal';

const AddMemoryButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="relative h-64 group overflow-hidden rounded-lg shadow-xl" data-aos="fade-up">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full h-full flex flex-col items-center justify-center bg-white/10 backdrop-blur-md group-hover:bg-white/20 transition-all duration-300"
        >
          <svg
            className="w-8 h-8 text-white/60 group-hover:text-white/90 transition-all duration-300 mb-3"
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
          <span className="text-lg text-white/60 group-hover:text-white/90 transition-all duration-300">
            Add Memory
          </span>
        </button>
      </div>
      <AddMemoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default AddMemoryButton;