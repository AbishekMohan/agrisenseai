"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Activity, Brain, LayoutGrid, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSensors } from '@/context/SensorContext';

export function Navigation() {
  const pathname = usePathname();
  const { t } = useSensors();

  const navItems = [
    { label: t('nav_home'), icon: Home, href: '/' },
    { label: t('nav_advisor'), icon: Brain, href: '/advisor' },
    { label: t('nav_sensors'), icon: Activity, href: '/sensors' },
    { label: t('nav_market'), icon: TrendingUp, href: '/prices' },
    { label: t('nav_more'), icon: LayoutGrid, href: '/more' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card/90 backdrop-blur-xl border-t flex justify-around py-4 px-2 z-50 shadow-[0_-8px_20px_rgba(0,0,0,0.1)] rounded-t-[2.5rem]">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300 relative px-3 py-1 rounded-2xl",
              isActive ? "text-primary bg-primary/5" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn("w-6 h-6", isActive && "fill-primary/20")} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
            {isActive && (
              <span className="absolute -top-1 w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(56,102,65,0.6)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}