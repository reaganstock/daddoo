import React from 'react';
import Section from '../ui/Section';
import MemoryCard from './MemoryCard';
import AddMemoryButton from './AddMemoryButton';
import useMemoryStore from '../../store/memoryStore';

const MemorySection = ({ isPreview }) => {
  const { memories, loading, error, fetchMemories } = useMemoryStore();

  React.useEffect(() => {
    fetchMemories();
  }, []);

  if (loading) {
    return (
      <Section title="Memories That Last Forever" id="memories">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-white">Loading memories...</div>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section title="Memories That Last Forever" id="memories">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-red-400">Error loading memories: {error}</div>
        </div>
      </Section>
    );
  }

  return (
    <Section title="Memories That Last Forever" id="memories">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8 mb-12">
          {memories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} isPreview={isPreview} />
          ))}
        </div>
        {!isPreview && (
          <div className="mt-12">
            <AddMemoryButton />
          </div>
        )}
      </div>
    </Section>
  );
};

export default MemorySection;