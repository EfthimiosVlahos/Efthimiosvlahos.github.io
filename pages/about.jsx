export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-8 opacity-0 animate-fade-in-up">About Me</h1>

      <div className="space-y-5 text-gray-700 dark:text-gray-300 leading-relaxed opacity-0 animate-fade-in-up animate-delay-100">
        <p>
          Hi, I&apos;m <strong className="text-gray-900 dark:text-white">Efthimios Vlahos</strong>, a Machine Learning Engineer at{' '}
          <span className="text-[#76b900] font-semibold">Con Edison</span>, where I design and implement advanced AI workflows, develop predictive models for analytics, and build scalable data pipelines. With a Master&apos;s in Applied Mathematics and Statistics from SUNY Stony Brook and a Bachelor&apos;s in Mathematics and Physics from CUNY Hunter College, I bring a rigorous foundation in computational theory, statistical modeling, and algorithmic design to every project.
        </p>
        <p>
          My expertise lies at the intersection of machine learning operations, robust data pipelines, and AI-driven architectures that deliver value across diverse domains. Whether embedding vector databases for semantic search or deploying containerized models with orchestration tools, I focus on building resilient, production-grade systems that scale with organizational needs. In my work, I&apos;ve tackled challenges in energy infrastructure optimization, manufacturing process automation, and financial forecasting, always prioritizing code efficiency, model interpretability, and seamless integration with cloud ecosystems.
        </p>
        <p>
          Beyond the technical stack, I&apos;m passionate about the theoretical underpinnings of AI&mdash;exploring topics like adaptive learning for dynamic environments and generative models for synthetic data generation. My projects reflect this blend of innovation and practicality: from developing autonomous AI trading systems that adapt to market volatility, to advancing generative deep learning frameworks for drug discovery pipelines that accelerate molecular simulations.
        </p>
        <p>
          When I&apos;m not engineering neural networks or debugging distributed systems, you&apos;ll find me diving into research papers on emerging paradigms like distributed learning or contributing to open-source repositories on GitHub. I&apos;m always eager to collaborate on projects that bridge academia and industry, turning abstract mathematical constructs into deployable software solutions.
        </p>
      </div>

      <h2 className="text-2xl font-semibold mt-12 mb-6 opacity-0 animate-fade-in-up animate-delay-200">
        Current &amp; Past Affiliations
      </h2>
      <div className="flex flex-wrap gap-8 items-center justify-center opacity-0 animate-fade-in-up animate-delay-300">
        {[
          { src: '/images/logos/Con_Ed.png', alt: 'Con Edison', label: 'Con Edison (Current)' },
          { src: '/images/logos/microsoft_logo.png', alt: 'Microsoft', label: 'Microsoft' },
          { src: '/images/logos/stonybrook_logo.png', alt: 'SUNY Stony Brook', label: 'SUNY Stony Brook (MS)' },
        ].map((item) => (
          <div key={item.alt} className="group relative flex flex-col items-center">
            <img src={item.src} alt={item.alt} className="h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
            <span className="mt-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-12 mb-4 opacity-0 animate-fade-in-up animate-delay-300">
        Education
      </h2>
      <div className="space-y-3 opacity-0 animate-fade-in-up animate-delay-400">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 shrink-0" />
          <div>
            <p className="font-medium">M.S. Applied Mathematics &amp; Statistics</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">SUNY Stony Brook University</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 shrink-0" />
          <div>
            <p className="font-medium">B.A. Mathematics &amp; Physics</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">CUNY Hunter College</p>
          </div>
        </div>
      </div>

      <div className="mt-12 opacity-0 animate-fade-in-up animate-delay-400">
        <a
          href="/Efthimios_Vlahos_Resume_Oct25.pdf"
          download
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium hover:border-primary-500 hover:text-primary-500 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Full Resume
        </a>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return { props: { title: 'About Me' } };
}
