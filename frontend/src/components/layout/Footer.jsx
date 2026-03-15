import React from 'react';
import { siteConfig } from '../../data/content';

const Footer = ({ isLoaded }) => {
  return (
    <footer 
      className={`border-t border-ash py-12 transition-all duration-1000 delay-500 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-silver text-sm">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <p className="text-silver text-sm font-mono">
          Last updated March 2026
        </p>
      </div>
    </footer>
  );
};

export default Footer;

