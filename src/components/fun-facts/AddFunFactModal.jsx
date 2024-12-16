import React, { useState } from 'react';
import Modal from 'react-modal';
import useFunFactStore from '../../store/funFactStore';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const AddFunFactModal = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const addFunFact = useFunFactStore((state) => state.addFunFact);
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter a fun fact');
      return;
    }

    setIsLoading(true);
    try {
      const funFact = {
        content: content.trim(),
        created_at: new Date().toISOString(),
        user_email: currentUser?.email
      };

      const result = await addFunFact(funFact);
      if (!result.success) {
        throw new Error(result.error || 'Failed to add fun fact');
      }

      toast.success('Fun fact added successfully');
      setContent('');
      onClose();
    } catch (error) {
      console.error('Error adding fun fact:', error);
      toast.error(error.message || 'Failed to add fun fact');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-2xl mx-auto mt-10 bg-gray-900/95 p-6 md:p-12 rounded-lg outline-none max-h-[90vh] overflow-y-auto"
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

      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Add a Fun Fact</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white text-lg md:text-xl mb-2 md:mb-3">Fun Fact</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 md:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 min-h-[100px]"
            placeholder="Share a fun fact about Trey..."
            required
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Adding Fun Fact...' : 'Add Fun Fact'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFunFactModal;