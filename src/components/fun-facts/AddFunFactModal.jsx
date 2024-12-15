import React, { useState } from 'react';
import Modal from 'react-modal';
import useFunFactsStore from '../../store/funFactsStore';

const AddFunFactModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const addFunFact = useFunFactsStore((state) => state.addFunFact);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addFunFact({
      title: title.trim(),
      content: content.trim(),
      image: image || null,
      date: new Date().toISOString(),
    });
    setTitle('');
    setContent('');
    setImage(null);
    onClose();
    window.location.reload();
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
            required
          />
        </div>
        <div>
          <label className="block text-white mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 bg-white/10 rounded-lg text-white"
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block text-white mb-2">Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full text-white"
          />
          {image && (
            <img
              src={image}
              alt="Preview"
              className="mt-2 w-full h-48 object-cover rounded-lg"
            />
          )}
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
            disabled={!title.trim() || !content.trim()}
            className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 disabled:opacity-50"
          >
            Add Fun Fact
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFunFactModal;