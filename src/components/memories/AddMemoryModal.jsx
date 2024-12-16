import React, { useState } from 'react';
import Modal from 'react-modal';
import useMemoryStore from '../../store/memoryStore';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const AddMemoryModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const addMemory = useMemoryStore((state) => state.addMemory);
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      toast.success('Image uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    if (!image) {
      toast.error('Please select an image');
      return;
    }

    setIsLoading(true);
    try {
      const memory = {
        title: title.trim(),
        content: content.trim(),
        image_url: image,
        created_at: new Date().toISOString(),
        user_email: currentUser?.email
      };

      const result = await addMemory(memory);
      if (!result.success) {
        throw new Error(result.error || 'Failed to add memory');
      }

      toast.success('Memory added successfully');
      setTitle('');
      setContent('');
      setImage('');
      onClose();
    } catch (error) {
      console.error('Error adding memory:', error);
      toast.error(error.message || 'Failed to add memory');
    } finally {
      setIsLoading(false);
    }
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
            placeholder="Enter a title for your memory"
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <label className="block text-white text-xl mb-3">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 bg-white/10 rounded-lg text-white text-lg"
            placeholder="Share your memory..."
            rows="4"
            disabled={isLoading}
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
            disabled={isLoading}
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
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Memory'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMemoryModal;