"use client";

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, ShieldCheck, AlertTriangle, RefreshCw, Leaf, Sparkles } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import { diagnoseCrop } from './actions';
import type { DiagnoseCropOutput } from '@/ai/flows/diagnose-crop-disease';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function CropDiagnosis() {
  const { settings, t } = useSensors();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnoseCropOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const data = await diagnoseCrop({
        photoDataUri: image,
        cropType: settings.cropType,
      });
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24">
      <section className="text-center space-y-2">
        <h2 className="text-3xl font-black text-primary flex items-center justify-center gap-2">
          <ShieldCheck className="w-8 h-8 text-accent" />
          {t('scan_title')}
        </h2>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{t('scan_subtitle')}</p>
      </section>

      <Card className="border-none shadow-2xl bg-card/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/20">
        <CardContent className="p-0">
          <div
            onClick={() => !loading && fileInputRef.current?.click()}
            className={cn(
              "h-80 w-full flex flex-col items-center justify-center cursor-pointer transition-all duration-500 relative",
              !image ? "bg-muted/30 border-2 border-dashed border-primary/20 m-4 rounded-[2rem] w-[calc(100%-2rem)]" : "bg-black"
            )}
          >
            {image ? (
              <>
                <Image src={image} alt="Crop" fill className="object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {!loading && !result && (
                  <div className="absolute bottom-6 flex gap-3">
                    <Button onClick={(e) => { e.stopPropagation(); setImage(null); }} variant="secondary" size="sm" className="rounded-full bg-white/10 backdrop-blur-md text-white border-none">Change</Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">Snap or Upload Photo</p>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Leaf, stem, or fruit</p>
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>

          <div className="p-6">
            {!result ? (
              <Button
                disabled={!image || loading}
                onClick={handleDiagnose}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-lg font-black rounded-2xl shadow-xl transition-all active:scale-95"
              >
                {loading ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 text-accent animate-pulse" />
                    {t('scan_btn')}
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-2 rounded-xl",
                      result.severity === 'High' ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-600"
                    )}>
                      {result.severity === 'High' ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-foreground leading-none">{result.identification}</h3>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                        Confidence: {(result.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => { setResult(null); setImage(null); }} className="rounded-full h-10 w-10">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-muted/40 border border-white/10">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Observation</p>
                    <p className="text-sm text-foreground leading-relaxed font-medium">{result.description}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="w-4 h-4 text-primary" />
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">Organic Treatment Plan</p>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed font-bold italic">
                      &quot;{result.organicTreatment}&quot;
                    </p>
                  </div>
                </div>

                <Button className="w-full bg-secondary text-primary font-black rounded-2xl h-14 hover:bg-secondary/80" onClick={() => { setResult(null); setImage(null); }}>
                  {t('scan_another')}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <section className="px-2 space-y-4">
        <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Guidelines</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Good Light', icon: '☀️' },
            { label: 'Clear Focus', icon: '🔍' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-card/40 border border-white/10 shadow-sm">
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
