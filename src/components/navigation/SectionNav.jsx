import React, { useState } from 'react';

const sections = [
  { id: 'tributes', label: 'Birthday Tributes', icon: '🎂' },
  { id: 'memories', label: 'Memories', icon: '📸' },
  { id: 'funfacts', label: 'Fun Facts', icon: '✨' }
];

const SectionNav = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  const handleSectionChange = (id) => {
    if (selectedSection === id) {
      // If clicking the same section, show all sections
      setSelectedSection(null);
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          element.style.display = 'block';
        }
      });
    } else {
      // Show only selected section
      setSelectedSection(id);
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          element.style.display = section.id === id ? 'block' : 'none';
        }
      });
    }
  };

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