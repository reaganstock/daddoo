import React, { useState, useEffect } from 'react';
import Section from '../ui/Section';
import FunFactsGrid from './FunFactsGrid';
import AddFunFactButton from './AddFunFactButton';
import { supabase } from '../../lib/supabase';
import Modal from '../ui/Modal';
import FunFactCard from './FunFactCard';

const FunFactsContainer = ({ isPreview = false }) => {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [funFacts, setFunFacts] = useState([]);

  React.useEffect(() => {
    if (!isPreview) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setCurrentUser(user);
      });
    }
  }, [isPreview]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle form submission and image upload
  };

  return (
    <Section id="fun-facts" title="Fun Facts">
      <div className="space-y-12 max-w-6xl mx-auto pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funFacts.map((funFact) => (
            <div key={funFact.id} className="transform hover:scale-[1.02] transition-transform duration-300">
              <FunFactCard
                funFact={funFact}
                isEditable={!isPreview && currentUser?.id === funFact.user_id}
              />
            </div>
          ))}
        </div>
        {!isPreview && currentUser && (
          <div className="mt-24">
            <button
              onClick={openModal}
              className="w-full bg-purple-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-purple-600 transition-colors duration-300 font-semibold text-lg"
            >
              Add Fun Fact
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal-content max-w-2xl mx-auto mt-20 bg-gray-900 rounded-xl p-6 relative overflow-y-auto max-h-[90vh]"
        overlayClassName="modal-overlay fixed inset-0 bg-black/75 z-50"
      >
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Add a Fun Fact</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Fun Fact</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 text-white"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
              >
                Add Fun Fact
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </Section>
  );
};

export default FunFactsContainer;