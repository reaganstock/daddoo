import React, { useState } from 'react';
import useFunFactsStore from '../store/funFactsStore';
import AddFunFactModal from './AddFunFactModal';

const FunFactsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const funFacts = useFunFactsStore((state) => state.funFacts);

  return (
    <div className="space-y-8 mb-16">
      <h2 className="text-3xl font-bold text-white text-center mb-8">Fun Facts About Dad</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {funFacts.map((fact) => (
          <div
            key={fact.id}
            className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6 transform hover:scale-105 transition-all duration-300"
            data-aos="fade-up"
          >
            <div className="flex items-center mb-4">
              <svg
                className="w-8 h-8 text-purple-300 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-bold text-white">{fact.title}</h3>
            </div>
            <p className="text-gray-200">{fact.content}</p>
          </div>
        ))}

        {/* Default fun facts */}
        <div
          className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6 transform hover:scale-105 transition-all duration-300"
          data-aos="fade-up"
        >
          <div className="flex items-center mb-4">
            <svg
              className="w-8 h-8 text-purple-300 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-bold text-white">Sports Commentary</h3>
          </div>
          <p className="text-gray-200">
            Master of creative player identification, turning every AJ Brown play into a Dalvin Cook highlight!
          </p>
        </div>

        <div
          className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6 transform hover:scale-105 transition-all duration-300"
          data-aos="fade-up"
        >
          <div className="flex items-center mb-4">
            <svg
              className="w-8 h-8 text-purple-300 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-bold text-white">Notre Dame Pride</h3>
          </div>
          <p className="text-gray-200">Called USC's defeat before it happened - a true football prophet!</p>
        </div>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6 group hover:bg-white/20 transition-all duration-300"
        data-aos="fade-up"
      >
        <div className="flex items-center justify-center">
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
            Add a Fun Fact
          </span>
        </div>
      </button>

      <AddFunFactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default FunFactsSection;