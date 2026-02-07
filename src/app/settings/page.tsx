"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSensors, type SupportedLanguage } from '@/context/SensorContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { Save, Database, Bell, Moon, Sun, Languages } from 'lucide-react';

const locations = [
  // North India
  'Amritsar, Punjab', 'Ludhiana, Punjab', 'Bathinda, Punjab', 'Jalandhar, Punjab', 'Patiala, Punjab',
  'Karnal, Haryana', 'Hisar, Haryana', 'Rohtak, Haryana', 'Sirsa, Haryana',
  'Meerut, Uttar Pradesh', 'Lucknow, Uttar Pradesh', 'Bareilly, Uttar Pradesh', 'Varanasi, Uttar Pradesh', 'Aligarh, Uttar Pradesh', 'Gorakhpur, Uttar Pradesh', 'Jhansi, Uttar Pradesh',
  'Jaipur, Rajasthan', 'Jodhpur, Rajasthan', 'Kota, Rajasthan', 'Sri Ganganagar, Rajasthan', 'Hanumangarh, Rajasthan',
  // West India
  'Nashik, Maharashtra', 'Pune, Maharashtra', 'Nagpur, Maharashtra', 'Aurangabad, Maharashtra', 'Sangli, Maharashtra', 'Kolhapur, Maharashtra', 'Akola, Maharashtra',
  'Ahmedabad, Gujarat', 'Rajkot, Gujarat', 'Surat, Gujarat', 'Junagadh, Gujarat', 'Mehsana, Gujarat', 'Anand, Gujarat',
  // Central India
  'Indore, Madhya Pradesh', 'Bhopal, Madhya Pradesh', 'Ujjain, Madhya Pradesh', 'Sagar, Madhya Pradesh', 'Rewa, Madhya Pradesh',
  'Raipur, Chhattisgarh', 'Bilaspur, Chhattisgarh',
  // East India
  'Patna, Bihar', 'Muzaffarpur, Bihar', 'Bhagalpur, Bihar', 'Gaya, Bihar',
  'Kolkata, West Bengal', 'Bardhaman, West Bengal', 'Malda, West Bengal', 'Jalpaiguri, West Bengal', 'Siliguri, West Bengal',
  'Bhubaneswar, Odisha', 'Cuttack, Odisha', 'Sambalpur, Odisha',
  // South India
  'Hyderabad, Telangana', 'Warangal, Telangana', 'Nizamabad, Telangana', 'Karimnagar, Telangana',
  'Vijayawada, Andhra Pradesh', 'Guntur, Andhra Pradesh', 'Kurnool, Andhra Pradesh', 'Nellore, Andhra Pradesh', 'Eluru, Andhra Pradesh',
  'Bengaluru, Karnataka', 'Mysuru, Karnataka', 'Hubballi, Karnataka', 'Davanagere, Karnataka', 'Raichur, Karnataka', 'Shivamogga, Karnataka',
  'Chennai, Tamil Nadu', 'Coimbatore, Tamil Nadu', 'Madurai, Tamil Nadu', 'Thanjavur, Tamil Nadu', 'Erode, Tamil Nadu', 'Salem, Tamil Nadu',
  'Palakkad, Kerala', 'Wayanad, Kerala', 'Kottayam, Kerala',
  // Northeast
  'Guwahati, Assam', 'Dibrugarh, Assam', 'Silchar, Assam',
];

const crops = ['Rice', 'Wheat', 'Cotton', 'Maize', 'Sugarcane', 'Soybean', 'Vegetables', 'Mustard', 'Groundnut', 'Pulses', 'Other'];

const languageOptions: { label: string; value: SupportedLanguage }[] = [
  { label: 'English', value: 'en' },
  { label: 'हिन्दी (Hindi)', value: 'hi' },
  { label: 'ਪੰਜਾਬੀ (Punjabi)', value: 'pb' },
  { label: 'தமிழ் (Tamil)', value: 'ta' },
  { label: 'తెలుగు (Telugu)', value: 'te' },
  { label: 'मराठी (Marathi)', value: 'mr' },
  { label: 'ಕನ್ನಡ (Kannada)', value: 'kn' },
  { label: 'বাংলা (Bengali)', value: 'bn' },
  { label: 'ગુજરાતી (Gujarati)', value: 'gu' },
];

export default function Settings() {
  const { settings, updateSettings, t } = useSensors();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [formData, setFormData] = useState(settings);

  const handleSave = () => {
    updateSettings(formData);
    toast({
      title: "Settings Saved",
      description: "Your farm profile and preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6 pb-28 animate-in fade-in slide-in-from-right-6 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-primary">{t('settings_title')}</h2>
          <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em]">Profile & System</p>
        </div>
        <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-2xl h-12 w-12 border-primary/20 shadow-sm bg-card/40 backdrop-blur-xl transition-all active:scale-90">
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>

      <Card className="border-none shadow-xl bg-card/40 backdrop-blur-xl overflow-hidden rounded-[2rem] border border-white/20">
        <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
          <CardTitle className="text-sm font-black flex items-center gap-2 text-primary uppercase tracking-widest">
            <Languages className="w-4 h-4" />
            {t('settings_lang')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2.5">
            <Select 
              value={formData.language} 
              onValueChange={(val: SupportedLanguage) => setFormData(prev => ({ ...prev, language: val }))}
            >
              <SelectTrigger className="bg-muted/50 border-none rounded-2xl h-14 px-5 text-sm font-medium">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl max-h-[300px]">
                {languageOptions.map(opt => <SelectItem key={opt.value} value={opt.value} className="rounded-xl font-medium">{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl bg-card/40 backdrop-blur-xl overflow-hidden rounded-[2rem] border border-white/20">
        <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
          <CardTitle className="text-sm font-black flex items-center gap-2 text-primary uppercase tracking-widest">
            <Database className="w-4 h-4" />
            {t('settings_profile')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2.5">
            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">Main Crop</Label>
            <Select 
              value={formData.cropType} 
              onValueChange={(val) => setFormData(prev => ({ ...prev, cropType: val }))}
            >
              <SelectTrigger className="bg-muted/50 border-none rounded-2xl h-14 px-5 text-sm font-medium">
                <SelectValue placeholder="Select crop" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl max-h-[300px]">
                {crops.map(c => <SelectItem key={c} value={c} className="rounded-xl font-medium">{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2.5">
            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">Farm Location</Label>
            <Select 
              value={formData.location} 
              onValueChange={(val) => setFormData(prev => ({ ...prev, location: val }))}
            >
              <SelectTrigger className="bg-muted/50 border-none rounded-2xl h-14 px-5 text-sm font-medium">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl max-h-[400px]">
                {locations.map(l => <SelectItem key={l} value={l} className="rounded-xl font-medium">{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl bg-card/40 backdrop-blur-xl overflow-hidden rounded-[2rem] border border-white/20">
        <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
          <CardTitle className="text-sm font-black flex items-center gap-2 text-primary uppercase tracking-widest">
            <Bell className="w-4 h-4" />
            {t('settings_notifications')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {Object.entries(formData.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between group">
              <div className="space-y-0.5">
                <Label className="text-xs font-black capitalize group-hover:text-primary transition-colors">{key} Alerts</Label>
              </div>
              <Switch 
                checked={value}
                onCheckedChange={(val) => setFormData(p => ({ ...p, notifications: { ...p.notifications, [key]: val } }))}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="fixed bottom-24 left-6 right-6 max-w-md mx-auto z-40">
        <Button onClick={handleSave} className="w-full h-16 bg-primary hover:bg-primary/90 shadow-[0_15px_30px_rgba(56,102,65,0.4)] rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95">
          <Save className="w-6 h-6" />
          {t('settings_save')}
        </Button>
      </div>
    </div>
  );
}
