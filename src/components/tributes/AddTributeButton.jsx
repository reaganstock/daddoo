import React, { useState } from 'react';
import AddTributeModal from './AddTributeModal';

const AddTributeButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-20 right-4 z-50 md:static md:z-auto">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-full shadow-xl transition-all duration-300 md:w-full md:rounded-lg md:justify-center md:py-4 md:px-8"
        >
          <svg
            className="w-6 h-6 md:w-8 md:h-8"
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
          <span className="text-sm md:text-xl">
            Add Tribute
          </span>
        </button>
      </div>
      <AddTributeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default AddTributeButton;