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

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    padding: '1rem',
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderRadius: '0.5rem',
    minHeight: '200px',
    position: 'relative',
    zIndex: 10
  };

  if (loading) {
    return (
      <Section id="tributes" title="Birthday Tributes">
        <div style={containerStyle}>
          <h2 className="text-2xl font-bold text-white mb-4">Tributes</h2>
          <div className="text-white">Loading tributes...</div>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section id="tributes" title="Birthday Tributes">
        <div style={containerStyle}>
          <h2 className="text-2xl font-bold text-white mb-4">Tributes</h2>
          <div className="text-red-500">{error}</div>
        </div>
      </Section>
    );
  }

  return (
    <Section id="tributes" title="Birthday Tributes">
      <div style={containerStyle}>
        <h2 className="text-2xl font-bold text-white mb-4">Tributes</h2>
        <div className="flex flex-col gap-4 w-full">
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
          <div className="mt-4">
            <AddTributeButton />
          </div>
        )}
      </div>
    </Section>
  );
};

export default TributeSection;