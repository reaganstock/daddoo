import React from 'react';
import MemoryCard from './MemoryCard';
import AddMemoryButton from './AddMemoryButton';
import useMemoryStore from '../../store/memoryStore';
import Section from '../ui/Section';

const MemorySection = ({ defaultMemories = [] }) => {
  const memories = useMemoryStore((state) => state.memories);
  
  return (
    <Section id="memories" title="Memories That Last Forever">
      <div className="space-y-8">
        {memories.map((memory) => (
          <MemoryCard key={memory.id} {...memory} />
        ))}
        {defaultMemories.map((memory, index) => (
          <MemoryCard key={`default-memory-${index}`} {...memory} />
        ))}
        <AddMemoryButton />
      </div>
    </Section>
  );
};

export default MemorySection;