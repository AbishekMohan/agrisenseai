"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, MapPin, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useSensors } from '@/context/SensorContext';

const priceHistory = [
  { day: 'D1', wheat: 2100, rice: 3800, cotton: 6200, maize: 1900 },
  { day: 'D2', wheat: 2150, rice: 3850, cotton: 6300, maize: 1950 },
  { day: 'D3', wheat: 2200, rice: 3900, cotton: 6450, maize: 2000 },
  { day: 'D4', wheat: 2250, rice: 3980, cotton: 6600, maize: 2020 },
  { day: 'D5', wheat: 2280, rice: 3960, cotton: 6700, maize: 2040 },
  { day: 'D6', wheat: 2300, rice: 3950, cotton: 6800, maize: 2050 },
];

const pricesByState: Record<string, any[]> = {
  'Punjab': [
    { name: 'Wheat', current: 2300, prev: 2200, trend: '+4.2%', up: true },
    { name: 'Rice', current: 3950, prev: 3980, trend: '-0.8%', up: false },
    { name: 'Cotton', current: 6800, prev: 6400, trend: '+6.2%', up: true },
    { name: 'Maize', current: 2050, prev: 2020, trend: '+1.5%', up: true },
  ],
  'Uttar Pradesh': [
    { name: 'Wheat', current: 2150, prev: 2070, trend: '+3.8%', up: true },
    { name: 'Rice', current: 3750, prev: 3810, trend: '-1.5%', up: false },
    { name: 'Cotton', current: 6400, prev: 6060, trend: '+5.5%', up: true },
    { name: 'Maize', current: 1900, prev: 1885, trend: '+0.8%', up: true },
  ],
};

export default function MarketPrices() {
  const { settings } = useSensors();
  const state = settings.location.split(', ')[1] || 'Punjab';
  const currentPrices = pricesByState[state] || pricesByState['Punjab'];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-2xl font-bold text-primary">Market Prices</h2>
        <p className="text-sm text-muted-foreground">Current crop prices & trends</p>
      </div>

      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border shadow-sm w-fit">
        <MapPin className="w-3 h-3 text-primary" />
        <span className="text-[10px] font-bold text-muted-foreground">Mandi prices — {settings.location}</span>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-bold">Price Trend (Last 6 Days)</CardTitle>
        </CardHeader>
        <CardContent className="p-2 h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} domain={[0, 8000]} />
              <Tooltip />
              <Line type="monotone" dataKey="wheat" stroke="#ECAA53" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="rice" stroke="#386641" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="cotton" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="maize" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <section className="space-y-4">
        {currentPrices.map((crop, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">{crop.name}</p>
                <p className="text-xl font-bold">₹{crop.current.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">per quintal</p>
              </div>
              <div className="text-right space-y-2">
                <div className={`flex items-center justify-end gap-1 text-sm font-bold ${crop.up ? 'text-green-600' : 'text-red-600'}`}>
                  {crop.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {crop.trend}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  vs last week: ₹{crop.prev.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="space-y-3">
        <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <p className="text-xs font-bold text-green-800">Best Selling Opportunity: Cotton (+6.2% in {state})</p>
        </div>
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3">
          <TrendingDown className="w-5 h-5 text-red-600" />
          <p className="text-xs font-bold text-red-800">Best Buying Opportunity: Rice (-0.8% in {state})</p>
        </div>
      </div>

      <footer className="text-center space-y-1">
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
          Prices as of February 2, 2026
        </p>
        <p className="text-[10px] text-muted-foreground opacity-60">
          💡 Mandi rates vary by state. Showing data for {state}.
        </p>
      </footer>
    </div>
  );
}
