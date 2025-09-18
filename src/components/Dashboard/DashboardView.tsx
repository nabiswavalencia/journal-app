// import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, Heart, Target, BookOpen, TrendingUp, DollarSign } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Habit, CycleEntry, MoodEntry, BudgetEntry } from '../../types';

const DashboardView: React.FC = () => {
  const [habits] = useLocalStorage<Habit[]>('habits', []);
  const [cycleEntries] = useLocalStorage<CycleEntry[]>('cycleEntries', []);
  const [moodEntries] = useLocalStorage<MoodEntry[]>('moodEntries', []);
  const [budgetEntries] = useLocalStorage<BudgetEntry[]>('budgetEntries', []);

  const today = new Date().toISOString().split('T')[0];
  
  // Calculate stats
  const todaysHabits = habits.filter(habit => 
    habit.completedDates.includes(today)
  );
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((todaysHabits.length / totalHabits) * 100) : 0;

  const latestMood = moodEntries.find(entry => entry.date === today);
  const latestCycle = cycleEntries.length > 0 ? cycleEntries[cycleEntries.length - 1] : null;

  // Budget this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyBudget = budgetEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
  });
  
  const monthlyIncome = monthlyBudget
    .filter(entry => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0);
  const monthlyExpenses = monthlyBudget
    .filter(entry => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-script font-bold text-primary">
          Good Morning, Beautiful! ✨
        </h1>
        <p className="text-muted-foreground">
          Welcome to your personal sanctuary
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="gradient-primary text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Habits Today</CardTitle>
            <Target className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todaysHabits.length}/{totalHabits}
            </div>
            <p className="text-xs opacity-90">
              {completionRate}% complete
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-secondary text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Mood</CardTitle>
            <Heart className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMood ? `${latestMood.mood}/5` : 'Not set'}
            </div>
            <p className="text-xs opacity-90">
              {latestMood ? '❤️ Logged' : 'How are you feeling?'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-soft-lavender text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cycle Phase</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {latestCycle?.phase || 'Unknown'}
            </div>
            <p className="text-xs opacity-90">
              {latestCycle ? 'Tracked' : 'Start tracking'}
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-warm text-foreground border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KSH {(monthlyIncome - monthlyExpenses).toLocaleString()}
            </div>
            <p className="text-xs opacity-90">
              Net balance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="soft-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-primary" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Target className="h-6 w-6" />
              <span className="text-sm">Log Habits</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Track Cycle</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Log Mood</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm">Write Journal</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle>Recent Habits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {habits.slice(0, 5).map((habit) => (
                <div key={habit.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg">{habit.icon}</div>
                    <div>
                      <p className="font-medium">{habit.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {habit.streak} day streak
                      </p>
                    </div>
                  </div>
                  <Badge variant={habit.completedDates.includes(today) ? "default" : "secondary"}>
                    {habit.completedDates.includes(today) ? 'Done' : 'Pending'}
                  </Badge>
                </div>
              ))}
              {habits.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No habits yet. Start building your routine!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle>Wellness Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Energy Level</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i <= (latestMood?.mood || 0) ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {latestCycle && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cycle Phase</span>
                  <Badge
                    variant="outline"
                    className={`
                      ${latestCycle.phase === 'menstrual' ? 'border-menstrual text-menstrual' : ''}
                      ${latestCycle.phase === 'follicular' ? 'border-follicular text-follicular' : ''}
                      ${latestCycle.phase === 'ovulation' ? 'border-ovulation text-ovulation' : ''}
                      ${latestCycle.phase === 'luteal' ? 'border-luteal text-luteal' : ''}
                    `}
                  >
                    {latestCycle.phase}
                  </Badge>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Habit Completion</span>
                <span className="text-sm font-bold text-primary">{completionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;