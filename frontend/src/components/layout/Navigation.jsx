import React from 'react';
import { navItems } from '../../data/content';

const Navigation = ({ activeSection, setActiveSection, isLoaded }) => {
  return (
    <nav 
      className={`pb-12 transition-all duration-1000 delay-200 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <ul className="flex flex-wrap gap-x-8 gap-y-2">
        {navItems.map((item) => (
          <li key={item}>
            <button
              onClick={() => setActiveSection(item.toLowerCase())}
              className={`text-sm transition-colors duration-300 ${
                activeSection === item.toLowerCase()
                  ? 'text-ivory'
                  : 'text-silver hover:text-silver'
              }`}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;

