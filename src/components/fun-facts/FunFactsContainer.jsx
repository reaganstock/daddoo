import React from 'react';
import FunFactsGrid from './FunFactsGrid';
import AddFunFactButton from './AddFunFactButton';
import Section from '../ui/Section';

const FunFactsContainer = ({ isPreview }) => {
  return (
    <Section title="Fun Facts About Trey" id="funfacts">
      <div className="space-y-8">
        <FunFactsGrid isPreview={isPreview} />
        {!isPreview && <AddFunFactButton />}
      </div>
    </Section>
  );
};

export default FunFactsContainer;