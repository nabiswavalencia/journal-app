import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DollarSign, Plus, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { BudgetEntry } from '../../types';
import { toast } from '../../hooks/use-toast';

const CATEGORIES = [
  'Food & Dining', 'Shopping', 'Transportation', 'Bills', 'Entertainment',
  'Health & Fitness', 'Travel', 'Education', 'Business', 'Personal Care', 'Other'
];

const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'
];

const BudgetTracker = () => {
  const [budgetEntries, setBudgetEntries] = useLocalStorage<BudgetEntry[]>('budgetEntries', []);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEntry, setNewEntry] = useState<{
    amount: string;
    currency: 'KSH' | 'USD';
    category: string;
    type: 'income' | 'expense';
    description: string;
  }>({
    amount: '',
    currency: 'KSH',
    category: '',
    type: 'expense',
    description: ''
  });

  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyEntries = budgetEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
  });

  const monthlyIncomeKSH = monthlyEntries
    .filter(entry => entry.type === 'income' && entry.currency === 'KSH')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const monthlyExpensesKSH = monthlyEntries
    .filter(entry => entry.type === 'expense' && entry.currency === 'KSH')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const monthlyIncomeUSD = monthlyEntries
    .filter(entry => entry.type === 'income' && entry.currency === 'USD')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const monthlyExpensesUSD = monthlyEntries
    .filter(entry => entry.type === 'expense' && entry.currency === 'USD')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const addEntry = () => {
    if (!newEntry.amount || !newEntry.category || !newEntry.description) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    const entry: BudgetEntry = {
      id: Date.now().toString(),
      date: today,
      amount: parseFloat(newEntry.amount),
      currency: newEntry.currency,
      category: newEntry.category,
      type: newEntry.type,
      description: newEntry.description
    };

    setBudgetEntries([entry, ...budgetEntries]);
    setNewEntry({
      amount: '',
      currency: 'KSH',
      category: '',
      type: 'expense',
      description: ''
    });
    setShowAddDialog(false);
    toast({ title: 'Entry added successfully! 💰' });
  };

  const deleteEntry = (entryId: string) => {
    setBudgetEntries(budgetEntries.filter(entry => entry.id !== entryId));
    toast({ title: 'Entry deleted' });
  };

  const getCategoryTotal = (category: string, type: 'income' | 'expense', currency: 'KSH' | 'USD') => {
    return monthlyEntries
      .filter(entry => entry.category === category && entry.type === type && entry.currency === currency)
      .reduce((sum, entry) => sum + entry.amount, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-script font-bold text-primary">Budget Tracker</h1>
          <p className="text-muted-foreground">Take control of your finances 💰</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Budget Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Button
                  variant={newEntry.type === 'income' ? 'default' : 'outline'}
                  onClick={() => setNewEntry({ ...newEntry, type: 'income' as const })}
                  className="flex-1"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Income
                </Button>
                <Button
                  variant={newEntry.type === 'expense' ? 'default' : 'outline'}
                  onClick={() => setNewEntry({ ...newEntry, type: 'expense' as const })}
                  className="flex-1"
                >
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Expense
                </Button>
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Amount"
                  type="number"
                  value={newEntry.amount}
                  onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                  className="flex-1"
                />
                <Select
                  value={newEntry.currency}
                  onValueChange={(value) => setNewEntry({ ...newEntry, currency: value as any })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KSH">KSH</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select
                value={newEntry.category}
                onValueChange={(value) => setNewEntry({ ...newEntry, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {(newEntry.type === 'income' ? INCOME_CATEGORIES : CATEGORIES).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Description"
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
              />

              <Button onClick={addEntry} className="w-full">
                Add Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="gradient-secondary text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income (KSH)</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monthlyIncomeKSH.toLocaleString()}
            </div>
            <p className="text-xs opacity-90">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-menstrual text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses (KSH)</CardTitle>
            <TrendingDown className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monthlyExpensesKSH.toLocaleString()}
            </div>
            <p className="text-xs opacity-90">This month</p>
          </CardContent>
        </Card>

        <Card className="gradient-primary text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income (USD)</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${monthlyIncomeUSD.toLocaleString()}
            </div>
            <p className="text-xs opacity-90">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-soft-lavender text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses (USD)</CardTitle>
            <TrendingDown className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${monthlyExpensesUSD.toLocaleString()}
            </div>
            <p className="text-xs opacity-90">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Net Balance */}
      <Card className="soft-shadow">
        <CardHeader>
          <CardTitle>Net Balance This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted">
              <h3 className="text-lg font-semibold">KSH</h3>
              <p className={`text-2xl font-bold ${
                monthlyIncomeKSH - monthlyExpensesKSH >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(monthlyIncomeKSH - monthlyExpensesKSH).toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <h3 className="text-lg font-semibold">USD</h3>
              <p className={`text-2xl font-bold ${
                monthlyIncomeUSD - monthlyExpensesUSD >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${(monthlyIncomeUSD - monthlyExpensesUSD).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="soft-shadow">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {budgetEntries.slice(0, 10).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    entry.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {entry.type === 'income' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{entry.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.category} • {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className={`font-bold ${
                      entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {entry.type === 'income' ? '+' : '-'}{entry.currency} {entry.amount.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteEntry(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {budgetEntries.length === 0 && (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your income and expenses to get insights into your spending habits.
                </p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Transaction
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetTracker;