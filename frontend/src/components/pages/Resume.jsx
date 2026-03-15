import React from 'react';
import { Download } from 'lucide-react';
import { SkillsGraph } from '../ui';
import { education, experience, skills, projects } from '../../data/content';

const Resume = () => {
  return (
    <div className="space-y-16 animate-fade-up">
      {/* Download CV Button */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-xl text-silver font-light">
          My academic and professional background.
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-2 px-4 py-2 border border-ash text-silver hover:bg-ivory hover:text-black hover:border-ivory transition-all duration-300 text-sm"
        >
          <Download className="w-4 h-4" />
          <span>Download CV</span>
        </a>
      </div>

      {/* Education */}
      <section>
        <h2 className="font-display text-3xl md:text-4xl text-ivory font-medium mb-8">Education</h2>
        <div className="space-y-8">
          {education.map((edu, idx) => (
            <div key={idx} className="border-l border-ash pl-6 hover:border-silver transition-colors duration-300">
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                <h3 className="text-lg text-ivory">{edu.degree}</h3>
                <span className="text-silver font-mono text-sm">{edu.period}</span>
              </div>
              <p className="text-silver mt-1">{edu.school}</p>
              <p className="text-silver text-sm mt-1">{edu.details}</p>
              {edu.coursework && edu.coursework.length > 0 && (
                <div className="mt-3 text-xs text-stone">
                  <span className="uppercase tracking-[0.18em] text-stone">Coursework</span>
                  <p className="mt-1 text-silver">
                    {edu.coursework.join(' · ')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section>
        <h2 className="font-display text-3xl md:text-4xl text-ivory font-medium mb-8">Experience</h2>
        <div className="space-y-10">
          {experience.map((exp, idx) => (
            <div key={idx} className="border-l border-ash pl-6 hover:border-silver transition-colors duration-300">
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                <h3 className="text-lg text-ivory">{exp.role}</h3>
                <span className="text-silver font-mono text-sm">{exp.period}</span>
              </div>
              <p className="text-silver mt-1">{exp.organization}</p>
              <p className="text-silver text-xs mt-1">{exp.location}</p>
              <ul className="mt-3 space-y-1">
                {exp.bullets.map((bullet, i) => (
                  <li key={i} className="text-silver text-md leading-relaxed flex gap-4">
                    <span className="text-stone mt-2">—</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="font-display text-3xl md:text-4xl text-ivory font-medium mb-8">Skills</h2>
        <SkillsGraph skills={skills} projects={projects} />
      </section>
    </div>
  );
};

export default Resume;

