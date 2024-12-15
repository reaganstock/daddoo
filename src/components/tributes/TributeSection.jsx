import React from 'react';
import TributeCard from './TributeCard';
import AddTributeButton from './AddTributeButton';
import useTributeStore from '../../store/tributeStore';
import { useAnimation } from '../../hooks/useAnimation';
import Section from '../ui/Section';

const TributeSection = () => {
  const tributes = useTributeStore((state) => state.tributes);
  useAnimation();

  const defaultTributes = [
    {
      id: 'default-tribute',
      content: `Hey daddoo, it's your son here...`,
      author: "Reagan",
      date: "2024-12-06T00:00:00.000Z"
    }
  ];

  return (
    <Section id="tributes" title="Birthday Tributes">
      <div className="space-y-8">
        {defaultTributes.map(tribute => (
          <TributeCard key={tribute.id} {...tribute} />
        ))}
        {tributes.map(tribute => (
          <TributeCard key={tribute.id} {...tribute} />
        ))}
        <AddTributeButton />
      </div>
    </Section>
  );
};

export default TributeSection;