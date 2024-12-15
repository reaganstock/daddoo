import React from 'react';

const Card = ({ children, className = '' }) => {
  const baseClasses = 'bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8';
  
  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;