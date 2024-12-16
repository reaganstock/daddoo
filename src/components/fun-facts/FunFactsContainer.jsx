import React from 'react';
import Section from '../ui/Section';
import FunFactsGrid from './FunFactsGrid';
import AddFunFactButton from './AddFunFactButton';
import { useAnimation } from '../../hooks/useAnimation';
import { supabase } from '../../lib/supabase';

const FunFactsContainer = ({ isPreview = false }) => {
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    if (!isPreview) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setCurrentUser(user);
      });
    }
  }, [isPreview]);

  return (
    <Section id="fun-facts" title="Fun Facts">
      <div className="space-y-12 max-w-6xl mx-auto pb-32">
        <FunFactsGrid isPreview={isPreview} />
        {!isPreview && currentUser && (
          <div className="mt-24">
            <AddFunFactButton />
          </div>
        )}
      </div>
    </Section>
  );
};

export default FunFactsContainer;