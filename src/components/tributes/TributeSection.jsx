import React, { useEffect } from 'react';
import TributeCard from './TributeCard';
import AddTributeButton from './AddTributeButton';
import useTributeStore from '../../store/tributeStore';
import { useAnimation } from '../../hooks/useAnimation';
import Section from '../ui/Section';
import { supabase } from '../../lib/supabase';

const TributeSection = ({ isPreview = false }) => {
  const { tributes, loading, error, fetchTributes } = useTributeStore();
  const [currentUser, setCurrentUser] = React.useState(null);
  useAnimation();

  useEffect(() => {
    fetchTributes();
    
    if (!isPreview) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setCurrentUser(user);
      });
    }
  }, [fetchTributes, isPreview]);

  if (loading) {
    return (
      <Section id="tributes" title="Birthday Tributes">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-white">Loading tributes...</div>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section id="tributes" title="Birthday Tributes">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-red-400">Error loading tributes: {error}</div>
        </div>
      </Section>
    );
  }

  return (
    <Section id="tributes" title="Birthday Tributes">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8 mb-12">
          {tributes.map((tribute) => (
            <div key={tribute.id} className="transform hover:scale-[1.02] transition-transform duration-300">
              <TributeCard
                tribute={tribute}
                isEditable={!isPreview && currentUser?.id === tribute.user_id}
              />
            </div>
          ))}
        </div>
        {!isPreview && currentUser && (
          <div className="mt-12">
            <AddTributeButton />
          </div>
        )}
      </div>
    </Section>
  );
};

export default TributeSection;