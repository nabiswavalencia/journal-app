
import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import { User, Bell, Palette, Download, Trash2, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  theme: 'light' | 'dark' | 'auto';
}

interface AppSettings {
  notifications: boolean;
  cycleReminders: boolean;
  habitReminders: boolean;
  budgetAlerts: boolean;
  dataBackup: boolean;
}

const SettingsPage = () => {
  const [profile, setProfile] = useLocalStorage<UserProfile>('userProfile', {
    name: 'Your Name',
    email: 'you@example.com',
    avatar: '',
    theme: 'light'
  });

  const [settings, setSettings] = useLocalStorage<AppSettings>('appSettings', {
    notifications: true,
    cycleReminders: true,
    habitReminders: true,
    budgetAlerts: true,
    dataBackup: false
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleProfileUpdate = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingsUpdate = (field: keyof AppSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExportData = () => {
    const allData = {
      profile,
      settings,
      habits: localStorage.getItem('habits'),
      cycleEntries: localStorage.getItem('cycleEntries'),
      budgetEntries: localStorage.getItem('budgetEntries'),
      moodEntries: localStorage.getItem('moodEntries'),
      journalEntries: localStorage.getItem('journalEntries')
    };
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `bullet-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAllData = () => {
    const keysToDelete = [
      'userProfile',
      'appSettings',
      'habits',
      'cycleEntries',
      'budgetEntries',
      'moodEntries',
      'journalEntries'
    ];
    
    keysToDelete.forEach(key => localStorage.removeItem(key));
    
    // Reset to defaults
    setProfile({
      name: 'Your Name',
      email: 'you@example.com',
      avatar: '',
      theme: 'light'
    });
    
    setSettings({
      notifications: true,
      cycleReminders: true,
      habitReminders: true,
      budgetAlerts: true,
      dataBackup: false
    });
    
    setShowDeleteDialog(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-script font-bold text-primary mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your journal experience</p>
      </div>

      {/* Profile Settings */}
      <Card className="soft-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleProfileUpdate('name', e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileUpdate('email', e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="theme">Theme Preference</Label>
            <select 
              id="theme"
              className="w-full mt-1 p-2 border rounded-md bg-background"
              value={profile.theme}
              onChange={(e) => handleProfileUpdate('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="soft-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive general app notifications</p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => handleSettingsUpdate('notifications', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="cycle-reminders">Cycle Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminders about your cycle</p>
            </div>
            <Switch
              id="cycle-reminders"
              checked={settings.cycleReminders}
              onCheckedChange={(checked) => handleSettingsUpdate('cycleReminders', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="habit-reminders">Habit Reminders</Label>
              <p className="text-sm text-muted-foreground">Daily habit tracking reminders</p>
            </div>
            <Switch
              id="habit-reminders"
              checked={settings.habitReminders}
              onCheckedChange={(checked) => handleSettingsUpdate('habitReminders', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="budget-alerts">Budget Alerts</Label>
              <p className="text-sm text-muted-foreground">Alerts when spending limits are reached</p>
            </div>
            <Switch
              id="budget-alerts"
              checked={settings.budgetAlerts}
              onCheckedChange={(checked) => handleSettingsUpdate('budgetAlerts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="soft-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="data-backup">Automatic Backup</Label>
              <p className="text-sm text-muted-foreground">Automatically backup your data locally</p>
            </div>
            <Switch
              id="data-backup"
              checked={settings.dataBackup}
              onCheckedChange={(checked) => handleSettingsUpdate('dataBackup', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex gap-3">
            <Button onClick={handleExportData} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete All Data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete All Data</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete all your journal data, 
                    including habits, cycle tracking, budget entries, mood entries, and journal entries.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteAllData}>
                    Delete All Data
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="soft-shadow">
        <CardContent className="pt-6 text-center text-sm text-muted-foreground">
          <p>Bullet Journal App v1.0</p>
          <p>Made with 💕 for organizing your beautiful life</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
