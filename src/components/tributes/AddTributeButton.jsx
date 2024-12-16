import React, { useState } from 'react';
import AddTributeModal from './AddTributeModal';

const AddTributeButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Fixed position button for mobile */}
      <div className="fixed bottom-6 right-6 z-50 md:static md:z-auto">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg md:hidden flex items-center justify-center"
          aria-label="Add Birthday Tribute"
        >
          <svg
            className="w-8 h-8"
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
        </button>

        {/* Desktop version */}
        <div className="hidden md:block bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8 hover:bg-white/20 transition-all duration-300" data-aos="fade-up">
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
      </div>
      <AddTributeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default AddTributeButton;