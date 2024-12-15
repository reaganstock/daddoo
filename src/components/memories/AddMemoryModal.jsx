import React, { useState } from 'react';
import Modal from 'react-modal';
import useMemoryStore from '../../store/memoryStore';
import { v4 as uuidv4 } from 'uuid';

const AddMemoryModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const addMemory = useMemoryStore((state) => state.addMemory);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setVideo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const memory = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      image,
      video,
      date: new Date().toISOString(),
      author: 'User' // Replace with actual user when auth is implemented
    };

    addMemory(memory);
    setTitle('');
    setDescription('');
    setImage(null);
    setVideo(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-4xl mx-auto mt-10 bg-gray-900/95 p-12 rounded-lg outline-none"
      overlayClassName="fixed inset-0 bg-black/75 flex items-center justify-center"
    >
      <h2 className="text-4xl font-bold text-white mb-8 text-center">Add a Memory</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-white text-xl mb-3">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 bg-white/10 rounded-lg text-white text-lg"
            required
          />
        </div>
        <div>
          <label className="block text-white text-xl mb-3">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-white/10 rounded-lg text-white text-lg"
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block text-white text-xl mb-3">Photo</label>
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
        <div>
          <label className="block text-white text-xl mb-3">Video (Optional)</label>
          <input
            type="file"
            accept="video/mp4,video/webm"
            onChange={handleVideoSelect}
            className="w-full text-white"
          />
        </div>
        <div className="flex justify-end gap-6 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 bg-gray-600 rounded-lg text-white text-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || !description.trim()}
            className="px-8 py-3 bg-purple-600 rounded-lg text-white text-lg hover:bg-purple-700 disabled:opacity-50"
          >
            Add Memory
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMemoryModal;