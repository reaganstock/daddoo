import React from 'react';
import FunFactsGrid from './FunFactsGrid';
import AddFunFactButton from './AddFunFactButton';
import { useAnimation } from '../../hooks/useAnimation';
import Section from '../ui/Section';

const FunFactsSection = () => {
  useAnimation();

  return (
    <Section id="funfacts" title="Fun Facts About Trey">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <FunFactsGrid />
        </div>
        <div className="mt-12">
          <AddFunFactButton />
        </div>
      </div>
    </Section>
  );
};

export default FunFactsSection;