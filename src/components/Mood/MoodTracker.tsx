import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Heart, Plus, Smile, Frown, Meh, Angry, Laugh } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { MoodEntry } from '../../types';
import { toast } from '../../hooks/use-toast';

const EMOTIONS = [
  'Happy', 'Sad', 'Anxious', 'Excited', 'Tired', 'Grateful', 
  'Frustrated', 'Peaceful', 'Overwhelmed', 'Confident', 'Lonely', 'Content'
];

const MOOD_COLORS = {
  1: 'bg-red-500',
  2: 'bg-orange-500', 
  3: 'bg-yellow-500',
  4: 'bg-green-500',
  5: 'bg-emerald-500'
};

const MOOD_ICONS = {
  1: Angry,
  2: Frown,
  3: Meh,
  4: Smile,
  5: Laugh
};

const MOOD_LABELS = {
  1: 'Terrible',
  2: 'Not Great',
  3: 'Okay',
  4: 'Good',
  5: 'Amazing'
};

const MoodTracker = () => {
  const [moodEntries, setMoodEntries] = useLocalStorage<MoodEntry[]>('moodEntries', []);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEntry, setNewEntry] = useState({
    mood: 3,
    emotions: [] as string[],
    notes: '',
    gratitude: [] as string[]
  });

  const today = new Date().toISOString().split('T')[0];
  
  const addEntry = () => {
    const entry: MoodEntry = {
      id: Date.now().toString(),
      date: today,
      mood: newEntry.mood,
      emotions: newEntry.emotions,
      notes: newEntry.notes,
      gratitude: newEntry.gratitude.filter(g => g.trim() !== '')
    };

    // Remove existing entry for today
    const filteredEntries = moodEntries.filter(e => e.date !== today);
    setMoodEntries([entry, ...filteredEntries]);
    
    setNewEntry({
      mood: 3,
      emotions: [],
      notes: '',
      gratitude: []
    });
    setShowAddDialog(false);
    toast({ title: 'Mood logged successfully! ✨' });
  };

  const toggleEmotion = (emotion: string) => {
    setNewEntry(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  const addGratitude = () => {
    setNewEntry(prev => ({
      ...prev,
      gratitude: [...prev.gratitude, '']
    }));
  };

  const updateGratitude = (index: number, value: string) => {
    setNewEntry(prev => ({
      ...prev,
      gratitude: prev.gratitude.map((item, i) => i === index ? value : item)
    }));
  };

  const removeGratitude = (index: number) => {
    setNewEntry(prev => ({
      ...prev,
      gratitude: prev.gratitude.filter((_, i) => i !== index)
    }));
  };

  const todaysMood = moodEntries.find(entry => entry.date === today);
  const averageMood = moodEntries.length > 0 
    ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length 
    : 0;

  // Get mood trend (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const moodTrend = last7Days.map(date => {
    const entry = moodEntries.find(e => e.date === date);
    return { date, mood: entry?.mood || 0 };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-script font-bold text-primary">Mood Tracker</h1>
          <p className="text-muted-foreground">Check in with yourself every day 💕</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Log Mood
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
            <DialogHeader>
              <DialogTitle>How are you feeling today?</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Mood Scale */}
              <div className="text-center space-y-4">
                <h3 className="font-medium">Rate your overall mood</h3>
                <div className="flex justify-center space-x-4">
                  {[1, 2, 3, 4, 5].map((rating) => {
                    const Icon = MOOD_ICONS[rating as keyof typeof MOOD_ICONS];
                    return (
                      <Button
                        key={rating}
                        variant={newEntry.mood === rating ? "default" : "outline"}
                        size="lg"
                        onClick={() => setNewEntry({ ...newEntry, mood: rating })}
                        className="h-16 w-16 flex-col"
                      >
                        <Icon className="h-6 w-6 mb-1" />
                        <span className="text-xs">{rating}</span>
                      </Button>
                    );
                  })}
                </div>
                <p className="text-sm text-muted-foreground">
                  {MOOD_LABELS[newEntry.mood as keyof typeof MOOD_LABELS]}
                </p>
              </div>

              {/* Emotions */}
              <div>
                <h3 className="font-medium mb-3">What emotions are you experiencing?</h3>
                <div className="grid grid-cols-3 gap-2">
                  {EMOTIONS.map((emotion) => (
                    <Button
                      key={emotion}
                      variant={newEntry.emotions.includes(emotion) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleEmotion(emotion)}
                    >
                      {emotion}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Gratitude */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">What are you grateful for?</h3>
                  <Button variant="outline" size="sm" onClick={addGratitude}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {newEntry.gratitude.map((item, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Something you're grateful for..."
                        value={item}
                        onChange={(e) => updateGratitude(index, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeGratitude(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="font-medium mb-3">Additional notes</h3>
                <Textarea
                  placeholder="How was your day? What happened? How are you feeling?"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  rows={4}
                />
              </div>

              <Button onClick={addEntry} className="w-full">
                Save Mood Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Mood */}
      {todaysMood ? (
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary" />
              <span>Today's Mood</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className={`p-3 rounded-full ${MOOD_COLORS[todaysMood.mood as keyof typeof MOOD_COLORS]} text-white`}>
                {React.createElement(MOOD_ICONS[todaysMood.mood as keyof typeof MOOD_ICONS], { className: "h-6 w-6" })}
              </div>
              <div>
                <p className="font-semibold text-lg">{MOOD_LABELS[todaysMood.mood as keyof typeof MOOD_LABELS]}</p>
                <p className="text-muted-foreground">{todaysMood.mood}/5</p>
              </div>
            </div>
            {todaysMood.emotions.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Emotions:</p>
                <div className="flex flex-wrap gap-2">
                  {todaysMood.emotions.map((emotion) => (
                    <Badge key={emotion} variant="secondary">{emotion}</Badge>
                  ))}
                </div>
              </div>
            )}
            {todaysMood.gratitude && todaysMood.gratitude.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Grateful for:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {todaysMood.gratitude.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {todaysMood.notes && (
              <div>
                <p className="text-sm font-medium mb-2">Notes:</p>
                <p className="text-sm text-muted-foreground">{todaysMood.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="soft-shadow">
          <CardContent className="text-center py-8">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">How are you feeling today?</h3>
            <p className="text-muted-foreground mb-4">
              Take a moment to check in with yourself
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Log Today's Mood
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mood Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle>Average Mood</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className={`inline-flex p-4 rounded-full mb-4 ${
              averageMood > 0 ? MOOD_COLORS[Math.round(averageMood) as keyof typeof MOOD_COLORS] : 'bg-muted'
            } text-white`}>
              {averageMood > 0 && React.createElement(
                MOOD_ICONS[Math.round(averageMood) as keyof typeof MOOD_ICONS], 
                { className: "h-8 w-8" }
              )}
            </div>
            <p className="text-2xl font-bold mb-2">{averageMood.toFixed(1)}/5</p>
            <p className="text-sm text-muted-foreground">
              Based on {moodEntries.length} entries
            </p>
          </CardContent>
        </Card>

        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle>7-Day Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-20 space-x-1">
              {moodTrend.map((day, index) => (
                <div key={index} className="flex flex-col items-center space-y-1">
                  <div 
                    className={`w-6 rounded-t ${
                      day.mood > 0 ? MOOD_COLORS[day.mood as keyof typeof MOOD_COLORS] : 'bg-muted'
                    }`}
                    style={{ height: `${(day.mood / 5) * 100}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {new Date(day.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      <Card className="soft-shadow">
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moodEntries.slice(0, 5).map((entry) => {
              const Icon = MOOD_ICONS[entry.mood as keyof typeof MOOD_ICONS];
              return (
                <div key={entry.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className={`p-2 rounded-full ${MOOD_COLORS[entry.mood as keyof typeof MOOD_COLORS]} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="font-medium">{new Date(entry.date).toLocaleDateString()}</p>
                      <Badge variant="outline">{entry.mood}/5</Badge>
                    </div>
                    {entry.emotions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {entry.emotions.map((emotion) => (
                          <Badge key={emotion} variant="secondary" className="text-xs">{emotion}</Badge>
                        ))}
                      </div>
                    )}
                    {entry.notes && (
                      <p className="text-sm text-muted-foreground">{entry.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
            {moodEntries.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No mood entries yet. Start tracking your daily emotions!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodTracker;