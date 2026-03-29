import { useState } from 'react';
import mlProjects from '../data/projects/ml-projects.json';
import devopsProjects from '../data/projects/devops-projects.json';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'ml', label: 'Machine Learning' },
  { key: 'devops', label: 'DevOps' },
];

const allProjects = [
  ...mlProjects.map((p) => ({ ...p, category: 'ml' })),
  ...devopsProjects.map((p) => ({ ...p, category: 'devops' })),
];

function ProjectCard({ project }) {
  return (
    <div className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.02] hover:border-primary-500/50 transition-all duration-300 overflow-hidden">
      {project.image && !project.image.includes('data:image') && (
        <div className="h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={project.image.startsWith('/') || project.image.startsWith('http') ? project.image : `/${project.image}`}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5">
        <h3 className="font-semibold text-base mb-2 group-hover:text-primary-500 transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags?.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          {project.source_code && (
            <a
              href={project.source_code}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-primary-500 hover:text-primary-400 transition-colors"
            >
              Source Code &rarr;
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-primary-500 hover:text-primary-400 transition-colors"
            >
              Live Demo &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? allProjects
    : allProjects.filter((p) => p.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-8 fade-in-up">Projects</h1>

      <div className="flex gap-2 mb-8 fade-in-up-1">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeCategory === cat.key
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in-up-2">
        {filtered.map((project) => (
          <ProjectCard key={`${project.category}-${project.id}`} project={project} />
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return { props: { title: 'Projects' } };
}
