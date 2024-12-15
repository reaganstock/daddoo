import React from 'react';

const Header = () => {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/80 backdrop-blur-md py-2"
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-white text-center md:text-left">
          Celebrating the Great Historic Life of Trey Stock
        </h1>
      </div>
    </header>
  );
};

export default Header;