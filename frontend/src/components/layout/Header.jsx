import React from 'react';
import { siteConfig } from '../../data/content';

const Header = ({ isLoaded }) => {
  return (
    <header 
      className={`pt-16 md:pt-24 pb-12 transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <h1 className="font-display text-5xl md:text-7xl text-ivory font-medium tracking-tight">
        {siteConfig.name}
      </h1>
      <p className="text-silver text-lg md:text-xl mt-4 font-light">
        {siteConfig.title}
      </p>
      <p className="text-silver text-sm mt-2">
        {siteConfig.affiliation}
      </p>
    </header>
  );
};

export default Header;

