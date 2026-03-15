import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../../data/content';

const Projects = () => {
  return (
    <div className="space-y-12 animate-fade-up">
      <p className="text-xl md:text-2xl leading-relaxed text-silver font-light max-w-3xl">
        A selection of projects I've worked on, spanning machine learning, 
        distributed systems, and full-stack development.
      </p>

      <div className="space-y-6">
        {projects.map((project, idx) => (
          <a
            key={idx}
            href={project.link}
            className="group block p-6 border border-ash hover:border-silver transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-ivory text-lg group-hover:text-chalk transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-silver text-xs font-mono">{project.year}</span>
                </div>
                <p className="text-silver text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t, i) => (
                    <span key={i} className="text-xs text-silver border border-ash px-2 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-silver group-hover:text-ivory group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Projects;
