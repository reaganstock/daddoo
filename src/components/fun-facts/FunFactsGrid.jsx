import React from 'react';
import useFunFactsStore from '../../store/funFactsStore';
import LegacyCard from './LegacyCard';

const FunFactsGrid = () => {
  const funFacts = useFunFactsStore((state) => state.funFacts);

  const defaultFacts = [
    {
      id: 'football',
      title: 'Football Commentary',
      content: 'Master of creative player identification, turning every AJ Brown play into a "Cook" highlight!',
      image: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/4047646.png'
    },
    {
      id: 'heroes',
      title: 'Heroes Legacy',
      content: 'These are the legends you\'ve always looked up to. The ones who shaped your love for the game, your values, and your spirit.',
      image: 'https://imgur.com/uzVxhSh.jpg'
    }
  ];

  return (
    <div className="space-y-8">
      {defaultFacts.map((fact) => (
        <LegacyCard key={fact.id} {...fact} />
      ))}
      
      {funFacts.map((fact) => (
        <LegacyCard key={fact.id} {...fact} />
      ))}
    </div>
  );
};

export default FunFactsGrid;