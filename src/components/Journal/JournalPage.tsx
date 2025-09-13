import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { BookOpen, Plus, Heart, Tag, Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { JournalEntry } from '../../types';
import { toast } from '../../hooks/use-toast';

const WEATHER_OPTIONS = [
  { icon: Sun, label: 'Sunny' },
  { icon: Cloud, label: 'Cloudy' },
  { icon: CloudRain, label: 'Rainy' },
  { icon: Snowflake, label: 'Snowy' }
];

const JournalPage = () => {
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>('journalEntries', []);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 3,
    tags: [] as string[],
    weather: '',
    highlights: [] as string[]
  });
  const [currentTag, setCurrentTag] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const addEntry = () => {
    if (!newEntry.content.trim()) {
      toast({ title: 'Please write something in your journal', variant: 'destructive' });
      return;
    }

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: today,
      title: newEntry.title || `Journal Entry - ${new Date().toLocaleDateString()}`,
      content: newEntry.content,
      mood: newEntry.mood,
      tags: newEntry.tags,
      weather: newEntry.weather,
      highlights: newEntry.highlights.filter(h => h.trim() !== '')
    };

    setJournalEntries([entry, ...journalEntries]);
    setNewEntry({
      title: '',
      content: '',
      mood: 3,
      tags: [],
      weather: '',
      highlights: []
    });
    setShowAddDialog(false);
    toast({ title: 'Journal entry saved! 📝' });
  };

  const addTag = () => {
    if (currentTag.trim() && !newEntry.tags.includes(currentTag.trim())) {
      setNewEntry(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addHighlight = () => {
    setNewEntry(prev => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }));
  };

  const updateHighlight = (index: number, value: string) => {
    setNewEntry(prev => ({
      ...prev,
      highlights: prev.highlights.map((item, i) => i === index ? value : item)
    }));
  };

  const removeHighlight = (index: number) => {
    setNewEntry(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-script font-bold text-primary">Daily Journal</h1>
          <p className="text-muted-foreground">Capture your thoughts and memories ✨</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Write in your journal</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <Input
                placeholder="Entry title (optional)"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              />

              <div>
                <label className="text-sm font-medium mb-2 block">How are you feeling? (1-5)</label>
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
                <label className="text-sm font-medium mb-2 block">Weather</label>
                <div className="flex space-x-2">
                  {WEATHER_OPTIONS.map(({ icon: Icon, label }) => (
                    <Button
                      key={label}
                      variant={newEntry.weather === label ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewEntry({ ...newEntry, weather: label })}
                      className="flex items-center space-x-1"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Today's highlights</label>
                <div className="space-y-2">
                  {newEntry.highlights.map((highlight, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        placeholder="Something good that happened today..."
                        value={highlight}
                        onChange={(e) => updateHighlight(index, e.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeHighlight(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addHighlight}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add highlight
                  </Button>
                </div>
              </div>

              <Textarea
                placeholder="What's on your mind? How was your day? What are you thinking about?"
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                rows={8}
                className="min-h-[200px]"
              />

              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Add a tag..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button variant="outline" size="sm" onClick={addTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newEntry.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={addEntry} className="w-full">
                Save Journal Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Recent Entries */}
      <div className="space-y-6">
        {journalEntries.map((entry) => (
          <Card key={entry.id} className="soft-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{entry.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString()} • Mood: {entry.mood}/5
                    {entry.weather && ` • ${entry.weather}`}
                  </p>
                </div>
                <Heart className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {entry.highlights.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Today's highlights:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {entry.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed">{entry.content}</p>
              </div>

              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {journalEntries.length === 0 && (
          <Card className="soft-shadow">
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Start your journaling journey</h3>
              <p className="text-muted-foreground mb-6">
                Writing in a journal helps you process thoughts, track progress, and preserve memories.
              </p>
              <Button onClick={() => setShowAddDialog(true)} className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Write your first entry
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JournalPage;