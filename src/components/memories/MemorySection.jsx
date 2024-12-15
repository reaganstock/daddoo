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
        <div className="text-white">Loading memories...</div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section title="Memories That Last Forever" id="memories">
        <div className="text-red-400">Error loading memories: {error}</div>
      </Section>
    );
  }

  return (
    <Section title="Memories That Last Forever" id="memories">
      <div className="space-y-8">
        {memories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} isPreview={isPreview} />
        ))}
        {!isPreview && <AddMemoryButton />}
      </div>
    </Section>
  );
};

export default MemorySection;