import React from 'react';
import useFunFactsStore from '../../store/funFactsStore';
import LegacyCard from './LegacyCard';

const FunFactsGrid = ({ isPreview }) => {
  const { funFacts } = useFunFactsStore();

  return (
    <div className="space-y-8">
      {funFacts.map((fact) => (
        <LegacyCard key={fact.id} {...fact} preview={isPreview} />
      ))}
    </div>
  );
};

export default FunFactsGrid;