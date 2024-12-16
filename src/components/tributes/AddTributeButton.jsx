import React, { useState } from 'react';
import AddTributeModal from './AddTributeModal';

const AddTributeButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8 hover:bg-white/20 transition-all duration-300" data-aos="fade-up">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex flex-col items-center justify-center gap-4 py-4"
        >
          <svg
            className="w-12 h-12 text-white/60 group-hover:text-white/90 transition-all duration-300"
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
          <span className="text-2xl text-white/60 group-hover:text-white/90 transition-all duration-300">
            Add Your Birthday Tribute
          </span>
        </button>
      </div>
      <AddTributeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default AddTributeButton;