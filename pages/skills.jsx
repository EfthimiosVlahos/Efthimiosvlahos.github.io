import skillsData from '../data/skills.json';
import certifications from '../data/certifications.json';

export default function SkillsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-10 opacity-0 animate-fade-in-up">
        Skills &amp; Certifications
      </h1>

      <h2 className="text-2xl font-semibold mb-5 opacity-0 animate-fade-in-up animate-delay-100">
        Skills
      </h2>
      <div className="overflow-x-auto mb-12 opacity-0 animate-fade-in-up animate-delay-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Category
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {skillsData.map((skill) => (
              <tr
                key={skill.category}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-3 px-4 font-medium text-primary-500 whitespace-nowrap">
                  {skill.category}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  {skill.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold mb-5 opacity-0 animate-fade-in-up animate-delay-300">
        Certifications
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-0 animate-fade-in-up animate-delay-400">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-500/50 transition-all"
          >
            {cert.image && (
              <img
                src={cert.image}
                alt={cert.name}
                className="w-12 h-12 object-contain shrink-0"
              />
            )}
            <div className="min-w-0">
              <h3 className="font-medium text-sm leading-tight">{cert.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{cert.date}</p>
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-500 hover:text-primary-400 mt-1 inline-block"
                >
                  View Credential &rarr;
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return { props: { title: 'Skills & Certifications' } };
}
