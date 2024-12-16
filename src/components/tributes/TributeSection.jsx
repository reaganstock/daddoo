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
        <div className="flex justify-center items-center py-12">
          <div className="text-white">Loading tributes...</div>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section id="tributes" title="Birthday Tributes">
        <div className="text-red-400">Error loading tributes: {error}</div>
      </Section>
    );
  }

  return (
    <Section id="tributes" title="Birthday Tributes">
      <div className="h-[calc(100vh-200px)] overflow-y-auto">
        <div className="space-y-8 max-w-4xl mx-auto pb-40">
          <div className="space-y-6">
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
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
              <div className="max-w-4xl mx-auto">
                <AddTributeButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default TributeSection;