const contactLinks = [
  {
    label: 'Email',
    value: 'vlahos89@gmail.com',
    href: 'mailto:vlahos89@gmail.com',
  },
  {
    label: 'GitHub',
    value: 'github.com/EfthimiosVlahos',
    href: 'https://github.com/EfthimiosVlahos',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/efthimios-vlahos',
    href: 'https://www.linkedin.com/in/efthimios-vlahos/',
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-8 fade-in-up">Contact</h1>

      <div className="space-y-4 fade-in-up-1">
        {contactLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith('mailto') ? undefined : '_blank'}
            rel={item.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
            className="flex items-center gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-500/50 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all group"
          >
            <div>
              <p className="font-medium group-hover:text-primary-500 transition-colors">{item.label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.value}</p>
            </div>
            <svg className="w-4 h-4 ml-auto text-gray-300 dark:text-gray-600 group-hover:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return { props: { title: 'Contact' } };
}
