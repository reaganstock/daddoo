import React, { useState } from 'react';

const sections = [
  { id: 'tributes', label: 'Birthday Tributes', icon: '🎂' },
  { id: 'memories', label: 'Memories', icon: '📸' },
  { id: 'funfacts', label: 'Fun Facts', icon: '✨' }
];

const SectionNav = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  const handleSectionChange = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSelectedSection(id);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md py-4 px-2 -mx-2 overflow-x-auto">
      <div className="flex justify-start md:justify-center gap-2 md:gap-4 min-w-max">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleSectionChange(section.id)}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap
              ${selectedSection === section.id 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
          >
            <span className="text-xl">{section.icon}</span>
            <span className="font-medium text-sm md:text-base">{section.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default SectionNav;