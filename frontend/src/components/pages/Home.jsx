import React from 'react';
import { Mail, MapPin, Github, Linkedin } from 'lucide-react';
import { ChatWindow, PhotoCarousel } from '../ui';
import { bio, projects, siteConfig, skills } from '../../data/content';

const Home = () => {
  return (
    <div className="space-y-20 animate-fade-up">
      {/* Hero Section with Photo */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-center">
        {/* Bio - takes 3 columns */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-display text-3xl md:text-4xl text-ivory font-medium">About Me</h2>
          <div className="space-y-4 text-silver leading-relaxed">
            {bio.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Photo Carousel - takes 2 columns */}
        {/* <div className="lg:col-span-3">
          <PhotoCarousel />
        </div> */}
      </section>
      <section className="w-full">
        <PhotoCarousel />
      </section>

      {/* Embedded Chat */}
      <section>
        <ChatWindow
          bio={bio}
          projects={projects}
          siteConfig={siteConfig}
          skills={skills}
        />
      </section>
      
      {/* Contact Section */}
      <section>
        <h2 className="font-display text-3xl md:text-4xl text-ivory font-medium mb-8">Get in Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-4 text-silver hover:text-ivory transition-colors group"
            >
              <Mail className="w-5 h-5 text-silver group-hover:text-silver transition-colors" />
              <span className="link-underline">{siteConfig.email}</span>
            </a>
            <div className="flex items-center gap-4 text-silver">
              <MapPin className="w-5 h-5 text-silver" />
              <span>{siteConfig.location}</span>
            </div>
          </div>
          <div className="flex gap-6">
            <a
              href={siteConfig.social.github}
              className="flex items-center gap-2 text-silver hover:text-ivory transition-colors group"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href={siteConfig.social.linkedin}
              className="flex items-center gap-2 text-silver hover:text-ivory transition-colors group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
              <span className="text-sm">LinkedIn</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

