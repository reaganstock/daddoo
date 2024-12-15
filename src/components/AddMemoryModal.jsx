import React, { useState } from 'react';
import Modal from 'react-modal';
import useMemoryStore from '../store/memoryStore';
import imageCompression from 'browser-image-compression';

const AddMemoryModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const addMemory = useMemoryStore((state) => state.addMemory);

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setImage({
          preview: reader.result,
          file: compressedFile
        });
      };
      
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !image) return;

    setUploading(true);
    try {
      const newMemory = {
        title: title.trim(),
        description: description.trim(),
        image: image.preview,
        date: new Date().toISOString()
      };

      addMemory(newMemory);
      window.location.reload(); // Refresh to show new memory
      setTitle('');
      setDescription('');
      setImage(null);
      onClose();
    } catch (error) {
      console.error('Error saving memory:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-2xl mx-auto mt-20 bg-gray-900/95 p-8 rounded-lg outline-none"
      overlayClassName="fixed inset-0 bg-black/75 flex items-center justify-center ReactModal__Overlay"
      closeTimeoutMS={200}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Add a Memory</h2>
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
          <label className="block text-white mb-2">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full text-white"
            required
          />
          {image && (
            <img
              src={image.preview}
              alt="Preview"
              className="mt-2 w-full h-48 object-cover rounded-lg"
            />
          )}
        </div>
        <div>
          <label className="block text-white mb-2">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            disabled={uploading || !title.trim() || !image}
            className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {uploading ? 'Saving...' : 'Save Memory'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMemoryModal;