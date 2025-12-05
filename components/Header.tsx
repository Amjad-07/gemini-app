
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-4xl font-extrabold tracking-widest text-white uppercase">
        Todo amjad
      </h1>
      {/* Dark mode toggle can be added here */}
    </header>
  );
};

export default Header;
