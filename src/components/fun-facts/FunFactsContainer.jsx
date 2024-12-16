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
      <div className="space-y-12">
        <div className="min-h-[500px] relative">
          <div className="overflow-y-auto h-[calc(100vh-200px)] pb-24">
            <div className="max-w-6xl mx-auto">
              <FunFactsGrid isPreview={isPreview} />
            </div>
          </div>
          {!isPreview && currentUser && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
              <div className="max-w-6xl mx-auto">
                <AddFunFactButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default FunFactsContainer;