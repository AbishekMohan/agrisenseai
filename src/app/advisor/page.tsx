"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, RefreshCw, User, Bot, Sparkles } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import { getPersonalizedRecommendations, askFarmingQuestion } from './actions';
import type { GeneratePersonalizedRecommendationsOutput } from '@/ai/flows/generate-personalized-recommendations';
import { cn } from '@/lib/utils';

const languageNames: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  pb: 'Punjabi',
  ta: 'Tamil',
  te: 'Telugu',
  mr: 'Marathi',
  kn: 'Kannada',
  bn: 'Bengali',
  gu: 'Gujarati',
};

export default function AIAdvisor() {
  const { sensors, settings, t } = useSensors();
  const [recommendations, setRecommendations] = useState<GeneratePersonalizedRecommendationsOutput>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Hello! I am your AgriSense advisor. How can I help you with your farm today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // AI can return arbitrary emoji strings; enforce a friendly, small allowlist so UI stays consistent.
  const getSafeIcon = (icon: string) => {
    const safeIcons = ['🌾', '🚜', '🌱', '💧', '☀️', '📈', '🛡️', '⚡', '🧪', '💡'];
    const match = safeIcons.find(safe => icon?.trim().startsWith(safe));
    return match ?? '💡';
  };

  useEffect(() => {
    setMounted(true);
    handleRefreshRecs();
  }, []);
  const handleRefreshRecs = async () => {
    setLoadingRecs(true);
    try {
      const result = await getPersonalizedRecommendations({
        soilMoisture: sensors.soilMoisture,
        soilTemperature: sensors.soilTemperature,
        soilPh: sensors.soilPh,
        nutrientLevel: sensors.nutrientLevel,
        weatherForecast: 'Mostly sunny for the next 3 days.',
        cropType: settings.cropType,
        location: settings.location,
        language: languageNames[settings.language],
      });
      setRecommendations(result);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoadingRecs(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await askFarmingQuestion({
        question: userMsg,
        language: languageNames[settings.language]
      });
      setChatMessages(prev => [...prev, { role: 'bot', text: response.answer }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, {
        role: 'bot',
        text: "I'm having a little trouble connecting. Please try again."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [chatMessages, isTyping]);

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              {t('advisor_title')} ({languageNames[settings.language]})
            </h2>
          </div>
          <Button onClick={handleRefreshRecs} variant="ghost" size="sm" className="h-9 gap-2 rounded-xl text-primary hover:bg-primary/10 transition-all active:scale-95" disabled={loadingRecs}>
            <RefreshCw className={cn("w-3 h-3", loadingRecs && "animate-spin")} />
            {t('common_refresh')}
          </Button>
        </div>

        <div className="grid gap-3">
          {recommendations.length > 0 ? recommendations.map((rec, i) => (
            <Card key={i} className="border-none shadow-sm bg-card/40 backdrop-blur-xl rounded-2xl group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <CardContent className="p-4 flex gap-4">
                <div className="text-3xl flex-shrink-0 pt-1 group-hover:rotate-12 transition-transform">
                  {getSafeIcon(rec.icon)}
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-foreground">{rec.title}</h3>
                    <Badge variant={rec.priority === 'High' ? 'destructive' : 'secondary'} className={cn(
                      "text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded-md"
                    )}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">{rec.action}</p>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-8 text-muted-foreground animate-pulse">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-xs font-black uppercase tracking-widest">{t('common_loading')}</p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-black text-primary">{t('advisor_chat_title')}</h2>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Speak in {languageNames[settings.language]}</p>
        </div>

        <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-xl overflow-hidden flex flex-col h-[480px] rounded-[2.5rem] border border-white/20">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-6">
              {chatMessages.map((msg, i) => (
                <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                  <div className={cn(
                    "w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                    msg.role === 'user' ? "bg-primary text-white" : "bg-secondary text-primary"
                  )}>
                    {msg.role === 'user' ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-[1.5rem] text-sm max-w-[85%] leading-relaxed shadow-sm font-medium",
                    msg.role === 'user'
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-secondary/50 text-foreground rounded-tl-none border border-white/10"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 animate-in fade-in duration-300">
                  <div className="w-9 h-9 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
                    <Bot className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-[1.5rem] rounded-tl-none text-xs flex gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 bg-background/40 border-t border-white/10 flex gap-2 backdrop-blur-2xl">
            <Input
              placeholder={`${t('advisor_ask_placeholder')} ${languageNames[settings.language]}...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 border-none bg-muted/50 focus-visible:ring-primary rounded-2xl h-14 px-5 text-sm font-medium"
            />
            <Button size="icon" onClick={handleSendMessage} className="bg-primary hover:bg-primary/90 rounded-2xl h-14 w-14 shrink-0 shadow-xl transition-all active:scale-90">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
