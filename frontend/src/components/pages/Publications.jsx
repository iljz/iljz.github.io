import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { publications, siteConfig } from '../../data/content';

const Publications = () => {
  return (
    <div className="space-y-12 animate-fade-up">
      <p className="text-xl md:text-2xl leading-relaxed text-silver font-light max-w-3xl">
        Selected publications. See{' '}
        <a href={siteConfig.social.googleScholar} className="text-ivory link-underline">
          Google Scholar
        </a>
        {' '}for a complete list.
      </p>

      <div className="space-y-1">
        {publications.map((pub, idx) => (
          <a
            key={idx}
            href={pub.link}
            className="group block py-6 border-b border-ash hover:border-silver transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-ivory text-lg leading-snug group-hover:text-chalk transition-colors">
                  {pub.title}
                </h3>
                <p className="text-silver text-sm mt-2">
                  {pub.venue} · {pub.year}
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-silver group-hover:text-ivory group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0 mt-1" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Publications;

