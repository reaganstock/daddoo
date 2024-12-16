import React, { useEffect } from 'react';
import Section from '../ui/Section';
import MemoryCard from './MemoryCard';
import useMemoryStore from '../../store/memoryStore';
import { useAnimation } from '../../hooks/useAnimation';
import { supabase } from '../../lib/supabase';
import AddMemoryButton from './AddMemoryButton';

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

  return (
    <Section id="memories" title="Memories">
      <div className="space-y-12 max-w-7xl mx-auto pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            <AddMemoryButton />
          </div>
        )}
      </div>
    </Section>
  );
};

export default MemorySection;