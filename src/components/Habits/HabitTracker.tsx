
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
// import { Calendar } from '../../components/ui/calendar'; 
import { Plus, Target, Flame, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Habit } from '../../types';
import { toast } from '../../hooks/use-toast';

const HABIT_ICONS = ['💪', '📚', '🧘', '💧', '🏃', '🎯', '🌟', '✨', '🌸', '💝'];
// const HABIT_COLORS = ['blush-pink', 'sage-green', 'soft-lavender', 'dusty-rose', 'mint-green'];

const HabitTracker = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [newHabit, setNewHabit] = useState({
    name: '',
    icon: '🎯',
    color: 'blush-pink',
    category: 'wellness' as const
  });

  const today = new Date().toISOString().split('T')[0];

  const addHabit = () => {
    if (!newHabit.name.trim()) return;

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      icon: newHabit.icon,
      color: newHabit.color,
      completedDates: [],
      streak: 0,
      bestStreak: 0,
      category: newHabit.category
    };

    setHabits([...habits, habit]);
    setNewHabit({ name: '', icon: '🎯', color: 'blush-pink', category: 'wellness' });
    setShowAddDialog(false);
    toast({ title: 'Habit added successfully! 🌟' });
  };

  const toggleHabit = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(today);
        let updatedDates;
        let newStreak = habit.streak;

        if (isCompleted) {
          updatedDates = habit.completedDates.filter(date => date !== today);
          newStreak = Math.max(0, habit.streak - 1);
        } else {
          updatedDates = [...habit.completedDates, today];
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (habit.completedDates.includes(yesterdayStr) || habit.streak === 0) {
            newStreak = habit.streak + 1;
          } else {
            newStreak = 1;
          }
        }

        return {
          ...habit,
          completedDates: updatedDates,
          streak: newStreak,
          bestStreak: Math.max(habit.bestStreak, newStreak)
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
    toast({ title: 'Habit deleted' });
  };

  const getStreakDays = (habit: Habit) => {
    const completedDates = habit.completedDates.sort();
    if (completedDates.length === 0) return [];

    const days = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.unshift({
        date: dateStr,
        completed: completedDates.includes(dateStr)
      });
    }
    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-script font-bold text-primary">Habit Tracker</h1>
          <p className="text-muted-foreground">Build your perfect routine, one day at a time ✨</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCalendarView(!showCalendarView)}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            {showCalendarView ? 'List View' : 'Calendar View'}
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Habit name..."
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                />
                <div className="grid grid-cols-5 gap-2">
                  {HABIT_ICONS.map((icon) => (
                    <Button
                      key={icon}
                      variant={newHabit.icon === icon ? "default" : "outline"}
                      className="h-12"
                      onClick={() => setNewHabit({ ...newHabit, icon })}
                    >
                      {icon}
                    </Button>
                  ))}
                </div>
                <Select
                  value={newHabit.category}
                  onValueChange={(value) => setNewHabit({ ...newHabit, category: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wellness">Wellness</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addHabit} className="w-full">
                  Create Habit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {showCalendarView ? (
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedHabit || ''} onValueChange={setSelectedHabit}>
              <SelectTrigger className="mb-4">
                <SelectValue placeholder="Select a habit to view" />
              </SelectTrigger>
              <SelectContent>
                {habits.map((habit) => (
                  <SelectItem key={habit.id} value={habit.id}>
                    {habit.icon} {habit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedHabit && (
              <div className="grid grid-cols-7 gap-2">
                {getStreakDays(habits.find(h => h.id === selectedHabit)!).map((day, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                      day.completed ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    {new Date(day.date).getDate()}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {habits.map((habit) => (
            <Card key={habit.id} className="soft-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={habit.completedDates.includes(today)}
                      onCheckedChange={() => toggleHabit(habit.id)}
                      className="h-6 w-6"
                    />
                    <div className="text-2xl">{habit.icon}</div>
                    <div>
                      <h3 className="font-semibold">{habit.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Flame className="h-4 w-4" />
                        <span>{habit.streak} day streak</span>
                        <Badge variant="outline">Best: {habit.bestStreak}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {getStreakDays(habit).slice(-7).map((day, index) => (
                        <div
                          key={index}
                          className={`w-6 h-6 rounded-full ${
                            day.completed ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHabit(habit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {habits.length === 0 && (
            <Card className="soft-shadow">
              <CardContent className="p-12 text-center">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No habits yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start building your perfect routine by adding your first habit!
                </p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Habit
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default HabitTracker;