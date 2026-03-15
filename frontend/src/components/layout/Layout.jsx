import React, { useState, useEffect } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = ({ children, activeSection, setActiveSection }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Subtle grain overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 md:px-8">
        <Header isLoaded={isLoaded} />
        <Navigation 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          isLoaded={isLoaded} 
        />
        
        <main 
          className={`pb-24 transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {children}
        </main>

        <Footer isLoaded={isLoaded} />
      </div>
    </div>
  );
};

export default Layout;

