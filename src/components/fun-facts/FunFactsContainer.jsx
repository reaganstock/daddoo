import React from 'react';
import FunFactsGrid from './FunFactsGrid';
import AddFunFactButton from './AddFunFactButton';
import Section from '../ui/Section';

const FunFactsContainer = () => {
  return (
    <Section id="funfacts" title="Fun Facts About Trey">
      <div className="space-y-8">
        <FunFactsGrid />
        <AddFunFactButton />
      </div>
    </Section>
  );
};

export default FunFactsContainer;