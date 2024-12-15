import React, { useState } from 'react';
import Modal from 'react-modal';
import useFunFactsStore from '../store/funFactsStore';

const AddFunFactModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const addFunFact = useFunFactsStore((state) => state.addFunFact);

  const handleSubmit = (e) => {
    e.preventDefault();
    addFunFact({
      title,
      content,
      date: new Date().toISOString(),
    });
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-2xl mx-auto mt-20 bg-gray-900/95 p-8 rounded-lg outline-none"
      overlayClassName="fixed inset-0 bg-black/75 flex items-center justify-center ReactModal__Overlay"
      closeTimeoutMS={200}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Add a Fun Fact</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-white/10 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 bg-white/10 rounded-lg text-white"
            rows="4"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded-lg text-white hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700"
          >
            Add Fun Fact
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFunFactModal;