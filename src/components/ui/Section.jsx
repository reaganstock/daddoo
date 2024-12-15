import React from 'react';

const Section = ({ id, title, children, className = '' }) => {
  return (
    <section id={id} className={`mb-16 ${className}`}>
      <h2 className="text-4xl font-bold text-white mb-8 text-center">{title}</h2>
      {children}
    </section>
  );
};

export default Section;