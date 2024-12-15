import React, { useState } from 'react';
import Modal from 'react-modal';
import useMemoryStore from '../../store/memoryStore';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const AddMemoryModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const addMemory = useMemoryStore((state) => state.addMemory);
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

  const handleImageSelect = async (event) => {
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

    setImage(file);
  };

  const uploadImage = async (file) => {
    try {
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('memories')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('memories')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      toast.error('Please select an image');
      return;
    }

    setIsLoading(true);
    try {
      // Upload image first
      const imageUrl = await uploadImage(image);

      const memory = {
        title: title || 'Memory',
        content: content || '',
        image_url: imageUrl,
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
      setImage(null);
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
          <label className="block text-white text-xl mb-3">Title (Optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 bg-gray-800/50 rounded-lg text-white text-lg"
            placeholder="Enter a title for your memory"
          />
        </div>

        <div>
          <label className="block text-white text-xl mb-3">Description (Optional)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 bg-gray-800/50 rounded-lg text-white text-lg"
            rows="4"
            placeholder="Add a description..."
          />
        </div>

        <div>
          <label className="block text-white text-xl mb-3">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full p-4 bg-gray-800/50 rounded-lg text-white text-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
            required
          />
          {image && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="max-h-48 rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
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