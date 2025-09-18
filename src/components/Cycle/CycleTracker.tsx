import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar } from '../../components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Heart, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { CycleEntry } from '../../types';
import { toast } from '../../hooks/use-toast';

const SYMPTOMS = [
  'Cramps', 'Bloating', 'Mood swings', 'Fatigue', 'Headache', 
  'Breast tenderness', 'Acne', 'Back pain', 'Nausea', 'Cravings'
];

const PHASE_INFO = {
  menstrual: {
    color: 'menstrual',
    title: 'Menstrual Phase (Days 1-5)',
    description: 'Your period. Focus on rest, gentle exercise, and iron-rich foods.',
    tips: ['Use heat therapy for cramps', 'Stay hydrated', 'Get extra sleep', 'Practice self-care']
  },
  follicular: {
    color: 'follicular',
    title: 'Follicular Phase (Days 1-13)',
    description: 'Energy is building. Great time for new projects and challenging workouts.',
    tips: ['Try new activities', 'Plan important meetings', 'Focus on protein', 'Strength training works well']
  },
  ovulation: {
    color: 'ovulation',
    title: 'Ovulation Phase (Days 14-16)',
    description: 'Peak energy and confidence. Perfect for social activities and important decisions.',
    tips: ['Schedule important events', 'High-intensity workouts', 'Network and socialize', 'Creative projects']
  },
  luteal: {
    color: 'luteal',
    title: 'Luteal Phase (Days 17-28)',
    description: 'Energy declines. Focus on completing tasks and preparing for your period.',
    tips: ['Gentle exercise like yoga', 'Avoid scheduling stressful events', 'Practice mindfulness', 'Prepare for next cycle']
  }
};

const CycleTracker = () => {
  const [cycleEntries, setCycleEntries] = useLocalStorage<CycleEntry[]>('cycleEntries', []);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newEntry, setNewEntry] = useState({
    phase: 'menstrual' as const,
    symptoms: [] as string[],
    mood: 3,
    flow: 'medium' as const,
    notes: ''
  });

  const addEntry = () => {
    if (!selectedDate) return;

    const entry: CycleEntry = {
      id: Date.now().toString(),
      date: selectedDate.toISOString().split('T')[0],
      phase: newEntry.phase,
      symptoms: newEntry.symptoms,
      mood: newEntry.mood,
      flow: newEntry.flow,
      notes: newEntry.notes
    };

    // Remove existing entry for this date
    const filteredEntries = cycleEntries.filter(e => e.date !== entry.date);
    setCycleEntries([...filteredEntries, entry].sort((a, b) => a.date.localeCompare(b.date)));
    
    setNewEntry({
      phase: 'menstrual',
      symptoms: [],
      mood: 3,
      flow: 'medium',
      notes: ''
    });
    setShowAddDialog(false);
    toast({ title: 'Cycle entry added! 🌸' });
  };

  const toggleSymptom = (symptom: string) => {
    setNewEntry(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  // const getEntryForDate = (date: Date) => {
  //   const dateStr = date.toISOString().split('T')[0];
  //   return cycleEntries.find(entry => entry.date === dateStr);
  // };

  const currentPhase = cycleEntries.length > 0 ? cycleEntries[cycleEntries.length - 1].phase : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-script font-bold text-primary">Cycle Tracker</h1>
          <p className="text-muted-foreground">Understanding your body's natural rhythm 🌙</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Log Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
            <DialogHeader>
              <DialogTitle>Log Cycle Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              
              <Select
                value={newEntry.phase}
                onValueChange={(value) => setNewEntry({ ...newEntry, phase: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="menstrual">Menstrual</SelectItem>
                  <SelectItem value="follicular">Follicular</SelectItem>
                  <SelectItem value="ovulation">Ovulation</SelectItem>
                  <SelectItem value="luteal">Luteal</SelectItem>
                </SelectContent>
              </Select>

              {newEntry.phase === 'menstrual' && (
                <Select
                  value={newEntry.flow}
                  onValueChange={(value) => setNewEntry({ ...newEntry, flow: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Flow intensity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="heavy">Heavy</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Mood (1-5)</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={newEntry.mood === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewEntry({ ...newEntry, mood: rating })}
                    >
                      {rating}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Symptoms</label>
                <div className="grid grid-cols-2 gap-2">
                  {SYMPTOMS.map((symptom) => (
                    <Button
                      key={symptom}
                      variant={newEntry.symptoms.includes(symptom) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSymptom(symptom)}
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder="Notes..."
                value={newEntry.notes}
                onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              />

              <Button onClick={addEntry} className="w-full">
                Save Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Phase Info */}
      {currentPhase && (
        <Card className="soft-shadow border-l-4" style={{ borderLeftColor: `hsl(var(--${PHASE_INFO[currentPhase].color}))` }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" style={{ color: `hsl(var(--${PHASE_INFO[currentPhase].color}))` }} />
              <span>{PHASE_INFO[currentPhase].title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{PHASE_INFO[currentPhase].description}</p>
            <div className="space-y-2">
              <h4 className="font-medium">Tips for this phase:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {PHASE_INFO[currentPhase].tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Phase Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(PHASE_INFO).map(([phase, info]) => (
          <Card key={phase} className="soft-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: `hsl(var(--${info.color}))` }}
                />
                <span className="capitalize">{phase}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{info.description}</p>
              <div className="space-y-1">
                {info.tips.slice(0, 2).map((tip, index) => (
                  <p key={index} className="text-xs text-muted-foreground">• {tip}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Entries */}
      <Card className="soft-shadow">
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cycleEntries.slice(-10).reverse().map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: `hsl(var(--${PHASE_INFO[entry.phase].color}))` }}
                  />
                  <div>
                    <p className="font-medium">{new Date(entry.date).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground capitalize">{entry.phase} phase</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Mood: {entry.mood}/5</Badge>
                  {entry.symptoms.length > 0 && (
                    <Badge variant="secondary">{entry.symptoms.length} symptoms</Badge>
                  )}
                </div>
              </div>
            ))}
            {cycleEntries.length === 0 && (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start tracking your cycle</h3>
                <p className="text-muted-foreground mb-4">
                  Understanding your cycle helps you plan better and feel more connected to your body.
                </p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Entry
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CycleTracker;