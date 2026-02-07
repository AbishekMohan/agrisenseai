"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { date: '1/25', moisture: 62, temp: 22, nutrients: 45 },
  { date: '1/26', moisture: 68, temp: 24, nutrients: 50 },
  { date: '1/27', moisture: 72, temp: 23, nutrients: 65 },
  { date: '1/28', moisture: 65, temp: 21, nutrients: 60 },
  { date: '1/29', moisture: 70, temp: 25, nutrients: 70 },
  { date: '1/30', moisture: 69, temp: 24, nutrients: 55 },
  { date: '1/31', moisture: 67, temp: 23, nutrients: 58 },
];

export default function SensorAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Sensor Analytics</h2>
        <p className="text-sm text-muted-foreground">7-day historical trends</p>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-bold text-blue-600">Soil Moisture (%)</CardTitle>
        </CardHeader>
        <CardContent className="p-2 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="moisture" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMoisture)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-bold text-orange-600">Soil Temperature (°C)</CardTitle>
        </CardHeader>
        <CardContent className="p-2 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} domain={[10, 40]} />
              <Tooltip />
              <Area type="monotone" dataKey="temp" stroke="#f97316" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-bold text-green-600">Nutrient Levels (Units)</CardTitle>
        </CardHeader>
        <CardContent className="p-2 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorNutrients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} domain={[30, 80]} />
              <Tooltip />
              <Area type="monotone" dataKey="nutrients" stroke="#10b981" fillOpacity={1} fill="url(#colorNutrients)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Avg Moisture</p>
            <p className="text-xl font-bold">68.5%</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Highest Temp</p>
            <p className="text-xl font-bold">27.8°C</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
        <p className="text-sm font-medium flex items-start gap-2">
          <span>💡</span>
          <span>Tip: Monitor these trends daily. Sudden changes may indicate irrigation issues or weather impacts.</span>
        </p>
      </div>
    </div>
  );
}
