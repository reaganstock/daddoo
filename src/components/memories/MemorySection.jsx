import React, { useEffect } from 'react';
import Section from '../ui/Section';
import MemoryCard from './MemoryCard';
import AddMemoryButton from './AddMemoryButton';
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

  return (
    <Section id="memories" title="Memories">
      <div className="space-y-12 max-w-4xl mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {memories.map((memory) => (
            <div key={memory.id} className="transform hover:scale-[1.02] transition-transform duration-300">
              <MemoryCard
                memory={memory}
                isEditable={!isPreview && currentUser?.email === memory.user_email}
              />
            </div>
          ))}
        </div>
        {!isPreview && currentUser && (
          <div className="mt-12 pb-12">
            <AddMemoryButton />
          </div>
        )}
      </div>
    </Section>
  );
};

export default MemorySection;