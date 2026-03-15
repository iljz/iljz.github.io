import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const ProjectCard = ({ title, description, tech, link, year }) => {
  return (
    <a
      href={link}
      className="group block p-6 border border-ash hover:border-silver transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-2">
            <h3 className="text-ivory text-lg group-hover:text-chalk transition-colors">
              {title}
            </h3>
            <span className="text-silver text-sm font-mono">{year}</span>
          </div>
          <p className="text-silver text-sm leading-relaxed mb-4">
            {description}
          </p>
          <div className="flex flex-wrap gap-2">
            {tech.map((t, i) => (
              <span key={i} className="text-sm text-silver border border-ash px-2 py-1">
                {t}
              </span>
            ))}
          </div>
        </div>
        <ArrowUpRight className="w-5 h-5 text-silver group-hover:text-ivory group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" />
      </div>
    </a>
  );
};

export default ProjectCard;

