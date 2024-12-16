import React from 'react';

const Section = ({ id, title, children, className = '' }) => {
  return (
    <section id={id} className={`min-h-screen py-16 px-4 ${className}`}>
      <h2 className="text-4xl font-bold text-white mb-8 text-center">{title}</h2>
      <div className="container mx-auto">
        {children}
      </div>
    </section>
  );
};

export default Section;