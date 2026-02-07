"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Calendar as CalIcon, StickyNote } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import { format } from 'date-fns';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

export default function FarmJournal() {
  const { t } = useSensors();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('agrisense_journal');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const saveEntries = (updated: JournalEntry[]) => {
    setEntries(updated);
    localStorage.setItem('agrisense_journal', JSON.stringify(updated));
  };

  const handleAddEntry = () => {
    if (!newNote.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: format(new Date(), 'PPP'),
      content: newNote
    };
    saveEntries([entry, ...entries]);
    setNewNote('');
  };

  const handleDelete = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="px-2">
        <h2 className="text-2xl font-black text-primary flex items-center gap-2">
          <StickyNote className="w-6 h-6" />
          {t('journal_title')}
        </h2>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Private field logs</p>
      </div>

      <Card className="border-none shadow-xl bg-card/40 backdrop-blur-xl rounded-[2rem] border border-white/20">
        <CardContent className="p-6 space-y-4">
          <Textarea 
            placeholder={t('journal_placeholder')}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[120px] rounded-2xl bg-muted/50 border-none focus-visible:ring-primary text-sm font-medium"
          />
          <Button onClick={handleAddEntry} className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 font-black gap-2 shadow-lg">
            <Plus className="w-5 h-5" />
            Add Observation
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {entries.map(entry => (
          <Card key={entry.id} className="border-none shadow-sm bg-card/40 backdrop-blur-md rounded-[1.5rem] group border border-white/10">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                  <CalIcon className="w-3 h-3" />
                  {entry.date}
                </div>
                <button onClick={() => handleDelete(entry.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                {entry.content}
              </p>
            </CardContent>
          </Card>
        ))}
        {entries.length === 0 && (
          <div className="text-center py-12 opacity-30">
            <StickyNote className="w-12 h-12 mx-auto mb-2" />
            <p className="text-xs font-black uppercase tracking-widest">No entries yet</p>
          </div>
        )}
      </div>
    </div>
  );
}