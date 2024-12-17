import React, { useState, useEffect } from 'react';
import TributeCard from './TributeCard';
import AddTributeButton from './AddTributeButton';
import { supabase } from '../../lib/supabase';
import Section from '../ui/Section';
import LoadingSpinner from '../ui/LoadingSpinner';

const TributeSection = ({ isPreview = false }) => {
  const [tributes, setTributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchTributes();
    if (!isPreview) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setCurrentUser(user);
      });
    }
  }, [isPreview]);

  const fetchTributes = async () => {
    try {
      const { data, error } = await supabase
        .from('tributes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTributes(data || []);
    } catch (error) {
      console.error('Error fetching tributes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="tributes" title="Birthday Tributes">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : (
        <div className="space-y-6">
          {tributes.map((tribute) => (
            <div key={tribute.id} className="transform hover:scale-[1.02] transition-transform duration-300">
              <TributeCard
                tribute={tribute}
                isEditable={!isPreview && currentUser?.id === tribute.user_id}
              />
            </div>
          ))}
          {!isPreview && currentUser && (
            <AddTributeButton />
          )}
        </div>
      )}
    </Section>
  );
};

export default TributeSection;