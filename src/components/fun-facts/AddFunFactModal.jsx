import React, { useState } from 'react';
import Modal from 'react-modal';
import useFunFactsStore from '../../store/funFactsStore';
import { toast } from 'react-hot-toast';

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '40rem',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    border: 'none',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    WebkitOverflowScrolling: 'touch'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
    overflow: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

const AddFunFactModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const addFunFact = useFunFactsStore((state) => state.addFunFact);

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
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await addFunFact({
        title: title.trim(),
        content: content.trim(),
        image: image || null,
        date: new Date().toISOString(),
      });
      
      toast.success('Fun fact added successfully!');
      setTitle('');
      setContent('');
      setImage(null);
      onClose();
    } catch (error) {
      console.error('Error adding fun fact:', error);
      toast.error('Failed to add fun fact. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles}
      contentLabel="Add Fun Fact Modal"
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 text-white/60 hover:text-white/90 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Add a Fun Fact</h2>
          <p className="text-white/60">Share something interesting about Trey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Give your fun fact a title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-1.5">
              Description
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Share your fun fact"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-1.5">
              Image (Optional)
            </label>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="funfact-image"
              />
              <label
                htmlFor="funfact-image"
                className="block w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors cursor-pointer text-center"
              >
                Choose Image
              </label>
              {image && (
                <div className="relative mt-4">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !title.trim() || !content.trim()}
            className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding Fun Fact...' : 'Add Fun Fact'}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AddFunFactModal;