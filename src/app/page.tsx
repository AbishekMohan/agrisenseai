"use client";

import { useState, useEffect } from 'react';
import { Droplets, Thermometer, Beaker, Leaf, CheckCircle2, Circle, Star, Sparkles, ShieldCheck, Zap, AlertCircle, TrendingUp, Timer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSensors } from '@/context/SensorContext';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function HomeDashboard() {
  const { sensors, lastUpdated, settings, t } = useSensors();
  const [mounted, setMounted] = useState(false);
  const [irrigationOn, setIrrigationOn] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculateHealthScore = () => {
    let score = 100;
    if (sensors.soilMoisture < 60 || sensors.soilMoisture > 85) score -= 15;
    if (sensors.soilTemperature < 20 || sensors.soilTemperature > 30) score -= 10;
    if (sensors.soilPh < 5.5 || sensors.soilPh > 7.5) score -= 15;
    if (sensors.nutrientLevel === 'Low') score -= 20;
    return Math.max(0, score);
  };

  const healthScore = calculateHealthScore();

  const tasks = [
    { id: 1, title: 'Morning Irrigation', completed: true, icon: '💧' },
    { id: 2, title: `Check ${settings.cropType} Health`, completed: false, icon: '🔎' },
    { id: 3, title: 'Apply Organic Fertilizer', completed: false, icon: '🌱' },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-7 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out pb-24">
      {/* Live Alerts Header */}
      {sensors.soilMoisture < 65 && (
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-3xl flex items-center gap-3 animate-bounce shadow-lg">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-[10px] font-black text-destructive uppercase tracking-widest">Urgent: Low Moisture ({sensors.soilMoisture.toFixed(1)}%)</p>
        </div>
      )}

      {/* Premium Farm Health Summary */}
      <section className="relative overflow-hidden rounded-[2.5rem] p-7 text-white shadow-premium health-gradient-excellent group border-none">
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-xl font-black uppercase tracking-widest text-white/90">{t('dashboard_integrity')}</h2>
              <p className="text-[10px] font-bold text-white/60 tracking-[0.3em]">{t('dashboard_live')}</p>
            </div>
            <div className="flex bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full items-center gap-2 border border-white/20 shadow-lg">
              <Star className="w-3.5 h-3.5 fill-accent text-accent animate-spin-slow" />
              <span className="text-[10px] font-black uppercase tracking-widest">Premium Care</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
              <div className="relative flex items-baseline gap-1">
                <span className="text-7xl font-black tracking-tighter text-glow">{healthScore}</span>
                <span className="text-xl font-bold opacity-60">/100</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${healthScore}%` }} 
                />
              </div>
              <p className="text-xs font-bold opacity-90 leading-relaxed">
                {t('dashboard_health_stable')}: {healthScore > 80 ? t('dashboard_health_excellent') : t('dashboard_health_stable')}.
              </p>
            </div>
          </div>
        </div>
        
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
      </section>

      {/* Crop Lifecycle Tracker */}
      <Card className="border-none shadow-sm bg-primary/5 rounded-[2rem] border border-primary/10 overflow-hidden">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-primary text-white p-3 rounded-2xl">
            <Timer className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Vegetative Stage</span>
              <span className="text-[10px] font-black text-muted-foreground">Day 42 of 120</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '35%' }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modern Sensor Grid */}
      <section className="grid grid-cols-2 gap-4">
        {[
          { key: 'dashboard_moisture', val: sensors.soilMoisture, icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10', unit: '%', optimal: '70-80%' },
          { key: 'dashboard_temp', val: sensors.soilTemperature, icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-500/10', unit: '°C', optimal: '22-26°C' },
          { key: 'dashboard_ph', val: sensors.soilPh, icon: Beaker, color: 'text-purple-500', bg: 'bg-purple-500/10', unit: '', optimal: '6.0-7.0' },
          { key: 'dashboard_nutrients', val: sensors.nutrientLevel, icon: Leaf, color: 'text-green-500', bg: 'bg-green-500/10', unit: '', optimal: 'High' }
        ].map((sensor, idx) => (
          <Card key={idx} className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-card/40 backdrop-blur-md rounded-[2rem] group overflow-hidden border border-white/10">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className={cn("p-2 rounded-2xl transition-transform group-hover:scale-110", sensor.bg)}>
                  <sensor.icon className={cn("w-5 h-5", sensor.color)} />
                </div>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t(sensor.key as any)}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">
                    {typeof sensor.val === 'number' ? sensor.val.toFixed(1) : sensor.val}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground uppercase">{sensor.unit}</span>
                </div>
                <Progress 
                  value={typeof sensor.val === 'number' ? (sensor.val / (sensor.key === 'dashboard_temp' ? 40 : sensor.key === 'dashboard_ph' ? 14 : 100)) * 100 : 85} 
                  className="h-1.5 bg-muted/50" 
                />
              </div>
              <p className="text-[9px] font-black text-muted-foreground/60 tracking-wider">RANGE: {sensor.optimal}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Live Market Alert */}
      <Card className="border-none shadow-lg bg-accent/5 border border-accent/20 rounded-[2rem] overflow-hidden">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent text-white p-2 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-accent-foreground">Market Alert</p>
              <p className="text-sm font-bold">{settings.cropType} prices up 4.2%</p>
            </div>
          </div>
          <Link href="/prices">
            <Button size="sm" variant="ghost" className="text-accent-foreground font-black text-[10px] uppercase">View All</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick Action Hub */}
      <section className="grid grid-cols-2 gap-4">
        <Button asChild variant="outline" className="h-28 flex-col gap-3 rounded-[2rem] bg-card/40 border-primary/10 shadow-sm hover:bg-primary/5 transition-all">
          <Link href="/diagnosis">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('dashboard_disease_scan')}</span>
          </Link>
        </Button>
        <Card className="border-none shadow-sm bg-card/40 backdrop-blur-md rounded-[2rem] border border-white/10">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 h-full">
            <div className={cn(
              "p-3 rounded-full transition-all duration-500",
              irrigationOn ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" : "bg-muted"
            )}>
              <Zap className={cn("w-6 h-6", irrigationOn ? "text-white animate-pulse" : "text-muted-foreground")} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">{t('dashboard_smart_valve')}</p>
            <button 
              onClick={() => setIrrigationOn(!irrigationOn)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                irrigationOn ? "bg-blue-500/20 text-blue-600" : "bg-muted/50 text-muted-foreground"
              )}
            >
              {irrigationOn ? t('dashboard_valve_active') : t('dashboard_valve_off')}
            </button>
          </CardContent>
        </Card>
      </section>

      {/* Elegant Daily Tasks */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em]">{t('dashboard_ops_log')}</h3>
          <Badge variant="secondary" className="bg-primary/5 text-primary text-[9px] font-black tracking-widest px-3 py-1 rounded-full">
            {tasks.filter(t => t.completed).length}/{tasks.length} DONE
          </Badge>
        </div>
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-card/40 backdrop-blur-sm border border-white/10 shadow-sm group hover:border-primary/30 transition-all active:scale-[0.98]">
              <div className="text-2xl group-hover:scale-110 transition-transform">{task.icon}</div>
              <div className="flex-1">
                <p className={cn("text-sm font-bold tracking-tight", task.completed ? "text-muted-foreground line-through opacity-60" : "text-foreground")}>
                  {task.title}
                </p>
              </div>
              {task.completed ? (
                <div className="bg-green-500/10 p-1.5 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              )}
            </div>
          ))}
        </div>
      </section>

      <Button asChild className="w-full h-18 text-lg font-black bg-primary hover:bg-primary/95 shadow-[0_15px_30px_rgba(56,102,65,0.3)] rounded-[2rem] transition-all hover:-translate-y-1 active:scale-95 border-none">
        <Link href="/advisor" className="flex items-center justify-center gap-3">
          <Sparkles className="w-6 h-6 text-accent animate-pulse" />
          {t('dashboard_advisor_btn')}
        </Link>
      </Button>

      <footer className="text-center pt-4 opacity-50 pb-10">
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          SYNCED: {format(lastUpdated, 'HH:mm:ss')}
        </p>
      </footer>
    </div>
  );
}
