// components/HomeInternalLinks.tsx
import Link from 'next/link';

export default function HomeInternalLinks() {
  const taskLinks = [
    { name: 'PostgreSQL & Database Optimization', href: '/tasks/database' },
    { name: 'Microservices & Coding Prompts', href: '/tasks/coding' },
    { name: 'Async Debugging Workflows', href: '/tasks/debugging' },
    { name: 'Automated Code Review Prompts', href: '/tasks/code-review' },
    { name: 'Pytest & Playwright Testing', href: '/tasks/testing' },
    { name: 'Backend Performance Auditing', href: '/tasks/performance' },
    { name: 'Application Security Auditing', href: '/tasks/security' },
    { name: 'Programmatic SEO Workflows', href: '/tasks/seo' },
  ];

  const modelLinks = [
    { name: 'Claude 3.5 Sonnet Workflows', href: '/models/claude' },
    { name: 'DeepSeek-R1 System Prompts', href: '/models/deepseek' },
    { name: 'OpenAI GPT-4o Prompts', href: '/models/chatgpt' },
    { name: 'Google Gemini 1.5 Pro Prompts', href: '/models/gemini' },
  ];

  const roleLinks = [
    { name: 'AI Prompts for Software Developers', href: '/roles/software-developer' },
    { name: 'Technical Founder Workflows', href: '/roles/founder' },
    { name: 'DevOps & Cloud Engineers', href: '/roles/devops' },
    { name: 'Growth & SEO Marketers', href: '/roles/marketer' },
  ];

  return (
    <section className="mt-20 border-t border-gray-800/80 pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl font-bold text-white mb-8">
          Browse Production Prompt Collections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tasks Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-4">
              Core Technical Tasks
            </h3>
            <ul className="space-y-2.5">
              {taskLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Models Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-4">
              AI Models & Playgrounds
            </h3>
            <ul className="space-y-2.5">
              {modelLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Roles Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-4">
              Engineering Disciplines
            </h3>
            <ul className="space-y-2.5">
              {roleLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
