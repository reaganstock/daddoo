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
      className="max-w-4xl mx-auto mt-10 bg-gray-900/95 p-6 md:p-12 rounded-lg outline-none max-h-[90vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black/75 flex items-start md:items-center justify-center overflow-y-auto"
      style={{
        overlay: {
          zIndex: 1000,
          padding: '1rem'
        }
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/60 hover:text-white/90 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Add a Memory</h2>
      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        <div>
          <label className="block text-white text-lg md:text-xl mb-2 md:mb-3">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 md:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
            placeholder="Enter memory title"
            required
          />
        </div>

        <div>
          <label className="block text-white text-lg md:text-xl mb-2 md:mb-3">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 md:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 min-h-[100px]"
            placeholder="Share your memory..."
            required
          />
        </div>

        <div>
          <label className="block text-white text-lg md:text-xl mb-2 md:mb-3">Image</label>
          <input
            type="file"
            onChange={handleImageSelect}
            accept="image/*"
            className="w-full px-4 py-2 md:py-3 bg-white/5 border border-white/10 rounded-lg text-white"
          />
          {image && (
            <div className="mt-4 relative max-h-[200px] overflow-hidden rounded-lg">
              <img
                src={image}
                alt="Memory preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Adding Memory...' : 'Add Memory'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMemoryModal;