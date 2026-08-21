'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Workflow, Bookmark, PlusCircle } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Prompts', href: '/prompts', icon: Compass },
    { label: 'Workflows', href: '/workflows', icon: Workflow },
    { label: 'Saved', href: '/saved', icon: Bookmark },
    { label: 'Submit', href: '/submit', icon: PlusCircle },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0D12]/95 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-emerald-400 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
