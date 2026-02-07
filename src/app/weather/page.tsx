"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, CloudLightning, Wind, Droplets } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';

const forecast = [
  { day: 'Today', icon: '☀️', temp: 28, rain: '10%', cond: 'Sunny' },
  { day: 'Sat, Jan 31', icon: '☀️', temp: 28, rain: '10%', cond: 'Ideal conditions' },
  { day: 'Sun, Feb 1', icon: '⛅', temp: 27, rain: '30%', cond: 'Ideal conditions' },
  { day: 'Mon, Feb 2', icon: '☁️', temp: 26, rain: '70%', cond: 'Cloudy' },
  { day: 'Tue, Feb 3', icon: '🌧️', temp: 24, rain: '85%', cond: 'Light Rain' },
  { day: 'Wed, Feb 4', icon: '🌧️', temp: 25, rain: '85%', cond: 'Rain' },
  { day: 'Thu, Feb 5', icon: '⛅', temp: 26, rain: '30%', cond: 'Partly Cloudy' },
  { day: 'Fri, Feb 6', icon: '☀️', temp: 29, rain: '5%', cond: 'Sunny' },
];

export default function WeatherForecast() {
  const { settings } = useSensors();

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-2xl font-bold text-primary">Weather Forecast</h2>
        <p className="text-sm text-muted-foreground">7-day outlook for your farm</p>
      </div>

      <Card className="bg-primary text-white border-none shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <CardContent className="p-6 space-y-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Current Weather</p>
              <h3 className="text-4xl font-bold">28°C</h3>
              <p className="text-xl font-medium">Sunny</p>
            </div>
            <div className="text-6xl drop-shadow-lg">☀️</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div className="text-center space-y-1">
              <CloudRain className="w-5 h-5 mx-auto opacity-70" />
              <p className="text-xs font-bold">10%</p>
              <p className="text-[10px] opacity-60">Rain</p>
            </div>
            <div className="text-center space-y-1">
              <Droplets className="w-5 h-5 mx-auto opacity-70" />
              <p className="text-xs font-bold">55%</p>
              <p className="text-[10px] opacity-60">Humidity</p>
            </div>
            <div className="text-center space-y-1">
              <Wind className="w-5 h-5 mx-auto opacity-70" />
              <p className="text-xs font-bold">12 km/h</p>
              <p className="text-[10px] opacity-60">Wind</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        {forecast.slice(1).map((item, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4 w-32">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-bold">{item.day}</span>
              </div>
              <div className="flex-1 flex justify-center">
                <span className="text-sm font-bold">{item.temp}°C</span>
              </div>
              <div className="w-20 text-right">
                <span className="text-[10px] font-bold text-blue-500 uppercase">Rain: {item.rain}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="border-none shadow-sm bg-accent/10 border-accent/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-accent-foreground flex items-center gap-2">
            🌱 Best Days for Farming
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {forecast.filter(f => f.cond.includes('Ideal') || f.cond === 'Sunny').slice(0, 3).map((f, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-accent/10 last:border-0">
              <span className="font-medium">{f.day} - {f.icon} {f.temp}°C</span>
              <span className="text-primary font-bold">✓ Ideal</span>
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground pt-2">Perfect for planting, irrigation, and harvesting activities</p>
        </CardContent>
      </Card>

      <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
        <p className="text-sm font-medium flex items-start gap-2">
          <span>💡</span>
          <span>Tip: Plan your irrigation around rainfall. The forecast shows rain on 2 days this week.</span>
        </p>
      </div>

      <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        Weather for {settings.location}
      </p>
    </div>
  );
}
