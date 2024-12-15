import React, { useState, useEffect } from 'react';

interface Section {
  id: string;
  label: string;
  icon: string;
}

const sections: Section[] = [
  { id: 'tributes', label: 'Birthday Tributes', icon: '🎂' },
  { id: 'memories', label: 'Memories', icon: '📸' },
  { id: 'funfacts', label: 'Fun Facts', icon: '✨' }
];

const SectionNav: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState('tributes');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        element.style.display = section.id === 'tributes' ? 'block' : 'none';
      }
    });
  }, []);

  const handleSectionChange = (id: string) => {
    setSelectedSection(id);
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        element.style.display = section.id === id ? 'block' : 'none';
      }
    });
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => handleSectionChange(section.id)}
          className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2
            ${selectedSection === section.id 
              ? 'bg-purple-600 text-white' 
              : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
        >
          <span className="text-xl">{section.icon}</span>
          <span className="font-medium">{section.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SectionNav;