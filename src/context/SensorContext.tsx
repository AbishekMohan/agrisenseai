"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, type TranslationKeys } from '@/lib/translations';

export type SupportedLanguage = 'en' | 'hi' | 'pb' | 'ta' | 'te' | 'mr' | 'kn' | 'bn' | 'gu';

type NutrientLevel = 'High' | 'Medium' | 'Low';

interface SensorData {
  soilMoisture: number;
  soilTemperature: number;
  soilPh: number;
  nutrientLevel: NutrientLevel;
}

interface UserSettings {
  cropType: string;
  farmSize: string;
  location: string;
  language: SupportedLanguage;
  notifications: {
    weather: boolean;
    prices: boolean;
    sensor: boolean;
  };
}

interface SensorContextType {
  sensors: SensorData;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  lastUpdated: Date;
  t: (key: TranslationKeys) => string;
}

const defaultSettings: UserSettings = {
  cropType: 'Rice',
  farmSize: '2.5',
  location: 'Chandigarh, Punjab',
  language: 'en',
  notifications: {
    weather: true,
    prices: true,
    sensor: true,
  },
};

const SensorContext = createContext<SensorContextType | undefined>(undefined);

export const SensorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sensors, setSensors] = useState<SensorData>({
    soilMoisture: 69.4,
    soilTemperature: 24.1,
    soilPh: 6.3,
    nutrientLevel: 'Medium',
  });

  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const saved = localStorage.getItem('agrisense_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('agrisense_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const t = useCallback((key: TranslationKeys): string => {
    const lang = settings.language;
    return translations[lang]?.[key] || translations.en[key] || key;
  }, [settings.language]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => {
        const moistureDelta = (Math.random() - 0.5) * 0.5;
        const tempDelta = (Math.random() - 0.5) * 0.2;
        const phDelta = (Math.random() - 0.5) * 0.05;
        
        let nextNutrients = prev.nutrientLevel;
        if (Math.random() > 0.98) {
          const levels: NutrientLevel[] = ['High', 'Medium', 'Low'];
          nextNutrients = levels[Math.floor(Math.random() * levels.length)];
        }

        return {
          soilMoisture: Math.min(100, Math.max(0, prev.soilMoisture + moistureDelta)),
          soilTemperature: Math.min(50, Math.max(0, prev.soilTemperature + tempDelta)),
          soilPh: Math.min(14, Math.max(0, prev.soilPh + phDelta)),
          nutrientLevel: nextNutrients,
        };
      });
      setLastUpdated(new Date());
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SensorContext.Provider value={{ sensors, settings, updateSettings, lastUpdated, t }}>
      {children}
    </SensorContext.Provider>
  );
};

export const useSensors = () => {
  const context = useContext(SensorContext);
  if (!context) throw new Error('useSensors must be used within a SensorProvider');
  return context;
};
