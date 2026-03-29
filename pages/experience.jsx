import experienceData from '../data/experience.json';

export default function ExperiencePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-10 opacity-0 animate-fade-in-up">
        Professional Experience
      </h1>

      <div className="space-y-10">
        {experienceData.map((job, index) => (
          <div
            key={job.id}
            className={`relative pl-8 border-l-2 border-gray-200 dark:border-gray-700 opacity-0 animate-fade-in-up animate-delay-${(index + 1) * 100}`}
          >
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-primary-500 bg-white dark:bg-[#16162a]" />

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-base">
                  <span style={{ color: job.companyColor }} className="font-semibold">
                    {job.company}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                    {job.location}
                  </span>
                </p>
              </div>
              <span className="text-sm text-gray-400 dark:text-gray-500 shrink-0">
                {job.period}
              </span>
            </div>

            <ul className="space-y-2 mt-3">
              {job.achievements.map((achievement, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  <span className="text-primary-500 mt-1 shrink-0">&bull;</span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return { props: { title: 'Professional Experience' } };
}
