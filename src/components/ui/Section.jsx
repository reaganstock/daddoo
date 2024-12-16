import React from 'react';

const Section = ({ id, title, children }) => {
  return (
    <section id={id} className="min-h-screen py-16 relative">
      <h2 className="text-4xl font-bold text-center mb-12">{title}</h2>
      {children}
    </section>
  );
};

export default Section;