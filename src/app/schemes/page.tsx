"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Landmark, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';

export default function GovtSchemes() {
  const { t } = useSensors();

  const schemes = [
    {
      name: 'PM-KISAN Samman Nidhi',
      benefit: '₹6,000 yearly income support',
      status: 'Active',
      type: 'Direct Benefit'
    },
    {
      name: 'Pradhan Mantri Fasal Bima Yojana',
      benefit: 'Crop insurance against natural calamities',
      status: 'Enrolling',
      type: 'Insurance'
    },
    {
      name: 'Soil Health Card Scheme',
      benefit: 'Free soil testing & recommendations',
      status: 'Available',
      type: 'Technical'
    },
    {
      name: 'PM Krishi Sinchai Yojana',
      benefit: 'Subsidies on micro-irrigation systems',
      status: 'State-wise',
      type: 'Irrigation'
    },
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="px-2">
        <h2 className="text-2xl font-black text-primary flex items-center gap-2">
          <Landmark className="w-6 h-6" />
          {t('schemes_title')}
        </h2>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Subsidies & Central Support</p>
      </div>

      <div className="grid gap-4">
        {schemes.map((scheme, i) => (
          <Card key={i} className="border-none shadow-sm bg-card/40 backdrop-blur-md rounded-[1.5rem] border border-white/10 group overflow-hidden">
            <CardHeader className="p-5 pb-2">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest">
                  {scheme.type}
                </Badge>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-widest">
                  <CheckCircle2 className="w-3 h-3" />
                  {scheme.status}
                </div>
              </div>
              <CardTitle className="text-base font-black leading-tight group-hover:text-primary transition-colors">
                {scheme.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 flex items-center justify-between gap-4">
              <p className="text-xs font-medium text-muted-foreground flex-1">
                {scheme.benefit}
              </p>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-primary p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <h3 className="text-lg font-black uppercase tracking-wider">Need Help with Application?</h3>
          <p className="text-xs font-medium opacity-80 leading-relaxed">
            Visit your nearest Common Service Center (CSC) or contact your local Agriculture Officer for verification assistance.
          </p>
          <button className="w-full h-12 rounded-xl bg-white text-primary font-black text-xs uppercase tracking-widest">
            Find Nearest CSC
          </button>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      </div>
    </div>
  );
}