'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, UserIcon } from 'app/components/icons';

const TABS = [
  { key: 'home', label: '首页', href: '/', Icon: HomeIcon },
  { key: 'me', label: '我的', href: '/me', Icon: UserIcon },
] as const;

export default function BottomTabs({ active }: { active: 'home' | 'me' }) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md">
      <div className="border-t border-line/80 bg-card/95 pb-safe backdrop-blur">
        <div className="grid grid-cols-2">
          {TABS.map(({ key, label, href, Icon }) => {
            const isActive = key === active || pathname === href;
            return (
              <Link
                key={key}
                href={href}
                className={`relative flex flex-col items-center gap-1 py-2.5 transition-colors ${
                  isActive ? 'text-accent' : 'text-ink-faint'
                }`}
              >
                <Icon className="h-6 w-6" filled={isActive} />
                <span className="text-[11px] font-medium">{label}</span>
                {isActive && (
                  <span className="absolute -top-px h-0.5 w-8 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
