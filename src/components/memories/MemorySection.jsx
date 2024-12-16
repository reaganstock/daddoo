import React, { useEffect } from 'react';
import Section from '../ui/Section';
import MemoryCard from './MemoryCard';
import useMemoryStore from '../../store/memoryStore';
import { useAnimation } from '../../hooks/useAnimation';
import { supabase } from '../../lib/supabase';

const MemorySection = ({ isPreview = false }) => {
  const { memories, loading, error, fetchMemories } = useMemoryStore();
  const [currentUser, setCurrentUser] = React.useState(null);
  useAnimation();

  useEffect(() => {
    fetchMemories();
    
    if (!isPreview) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setCurrentUser(user);
      });
    }
  }, [fetchMemories, isPreview]);

  if (loading) {
    return (
      <Section id="memories" title="Memories">
        <div className="flex justify-center items-center py-12">
          <div className="text-white">Loading memories...</div>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section id="memories" title="Memories">
        <div className="text-red-400">Error loading memories: {error}</div>
      </Section>
    );
  }

  const openModal = () => {
    // You need to implement the logic to open the modal here
  };

  return (
    <Section id="memories" title="Memories">
      <div className="space-y-12 max-w-6xl mx-auto pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory) => (
            <div key={memory.id} className="transform hover:scale-[1.02] transition-transform duration-300">
              <MemoryCard
                memory={memory}
                isEditable={!isPreview && currentUser?.id === memory.user_id}
              />
            </div>
          ))}
        </div>
        {!isPreview && currentUser && (
          <div className="mt-24">
            <button
              onClick={openModal}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300 font-semibold text-lg"
            >
              Add Memory
            </button>
          </div>
        )}
      </div>
    </Section>
  );
};

export default MemorySection;