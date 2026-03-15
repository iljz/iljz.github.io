import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { photos } from '../../data/content';

const PhotoCarousel = () => {
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef(null);
  const positionRef = useRef(0);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(null);

  // Duplicate photos for seamless infinite scroll
  const duplicatedPhotos = [...photos, ...photos, ...photos];

  // Speed: pixels per millisecond (normal vs slow)
  const normalSpeed = 0.05; // ~50px per second
  const slowSpeed = 0.015;  // ~15px per second

  const animate = useCallback((timestamp) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }

    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    const speed = isHovered ? slowSpeed : normalSpeed;
    positionRef.current += deltaTime * speed;

    // Get track width (one third since we tripled the photos)
    if (trackRef.current) {
      const trackWidth = trackRef.current.scrollWidth / 3;
      
      // Reset position when we've scrolled one full set
      if (positionRef.current >= trackWidth) {
        positionRef.current = positionRef.current - trackWidth;
      }

      trackRef.current.style.transform = `translateX(-${positionRef.current}px)`;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isHovered]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  const scroll = (direction) => {
    const scrollAmount = 300;
    positionRef.current += direction === 'left' ? -scrollAmount : scrollAmount;
    
    // Keep position positive
    if (trackRef.current) {
      const trackWidth = trackRef.current.scrollWidth / 3;
      if (positionRef.current < 0) {
        positionRef.current += trackWidth;
      }
    }
  };

  return (
    <div 
      className="relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Scrolling container */}
      <div
        className="flex gap-4 overflow-x-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        }}
      >
        <div 
          ref={trackRef}
          className="flex gap-4"
        >
          {duplicatedPhotos.map((photo, idx) => (
            <div
              key={idx}
              className="relative flex-shrink-0 w-64 md:w-64 aspect-[3.5/3] bg-ink overflow-hidden group/photo"
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/photo:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              {/* Caption overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300">
                <p className="absolute bottom-3 left-3 right-3 text-chalk text-sm">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-chalk/60 hover:text-chalk hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-chalk/60 hover:text-chalk hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default PhotoCarousel;
