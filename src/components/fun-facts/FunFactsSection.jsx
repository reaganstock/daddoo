import React from 'react';
import FunFactsGrid from './FunFactsGrid';
import AddFunFactButton from './AddFunFactButton';
import { useAnimation } from '../../hooks/useAnimation';

const FunFactsSection = () => {
  useAnimation();

  return (
    <div className="space-y-8 mb-16">
      <h2 className="text-3xl font-bold text-white text-center mb-8">Fun Facts About Trey</h2>
      <FunFactsGrid />
      <AddFunFactButton />
    </div>
  );
};

export default FunFactsSection;