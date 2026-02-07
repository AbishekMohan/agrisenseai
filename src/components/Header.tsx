"use client";

import { Leaf, UserCircle, MapPin, Sparkles } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import Link from 'next/link';

export function Header() {
  const { settings, t } = useSensors();

  return (
    <header className="px-6 py-5 border-b bg-card/40 backdrop-blur-2xl flex items-center justify-between sticky top-0 z-50 border-white/10">
      <div className="flex items-center gap-3.5">
        <div className="bg-primary p-2.5 rounded-[1.2rem] shadow-[0_8px_20px_rgba(56,102,65,0.3)] group transition-all hover:scale-105 active:scale-90">
          <Leaf className="w-5.5 h-5.5 text-white transition-transform group-hover:rotate-12" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-black text-primary leading-none tracking-tighter">{t('header_title')}</h1>
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
          </div>
          <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">
            <MapPin className="w-2.5 h-2.5 text-primary" />
            <span>{settings.cropType} • {settings.location.split(',')[0]}</span>
          </div>
        </div>
      </div>
      <Link href="/settings" className="p-2 bg-muted/40 hover:bg-muted rounded-2xl transition-all border border-transparent hover:border-border active:scale-90 shadow-sm">
        <UserCircle className="w-7 h-7 text-primary/80" />
      </Link>
    </header>
  );
}
