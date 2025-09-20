import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Heart, 
  Eye, 
  EyeOff,
  Download,
  Trash2
} from "lucide-react";
import { useAuthStore } from "@/util/AuthContext";

const Profile = () => {
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);
  const [notifications, setNotifications] = useState({
    mood_reminders: true,
    habit_reminders: true,
    community_updates: false,
    ai_insights: true
  });

  const { name, email, isAuthenticated } = useAuthStore();

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userStats = {
    joinDate: "March 1, 2024",
    totalEntries: 127,
    longestStreak: 18,
    currentLevel: 8,
    achievements: 12
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Your Profile
            </h1>
            <p className="text-muted-foreground">Manage your account and privacy settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-xl">{getInitials(name || '')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">{name || 'User'}</h3>
                      <p className="text-muted-foreground">Member since {userStats.joinDate}</p>
                      <Badge className="mt-1">Level {userStats.currentLevel}</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">Display Name</Label>
                      <Input id="username" defaultValue={name || ''} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={email || ''} />
                    </div>
                  </div>
                  
                  <Button className="bg-gradient-primary hover:opacity-90">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>

              {/* ...existing privacy settings and notifications cards... */}
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Anonymous Mode</h3>
                      <p className="text-sm text-muted-foreground">Hide your identity in community posts</p>
                    </div>
                    <Switch 
                      checked={anonymousMode}
                      onCheckedChange={setAnonymousMode}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Data Sharing for AI Insights</h3>
                      <p className="text-sm text-muted-foreground">Allow anonymized data to improve AI recommendations</p>
                    </div>
                    <Switch 
                      checked={dataSharing}
                      onCheckedChange={setDataSharing}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Data Controls</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Data
                      </Button>
                      <Button variant="destructive" size="sm" className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium capitalize">
                          {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {key === 'mood_reminders' && "Daily reminders to track your mood"}
                          {key === 'habit_reminders' && "Reminders for your daily habits"}
                          {key === 'community_updates' && "Updates from community interactions"}
                          {key === 'ai_insights' && "Weekly AI-generated insights and tips"}
                        </p>
                      </div>
                      <Switch 
                        checked={value}
                        onCheckedChange={(checked) => 
                          setNotifications({...notifications, [key]: checked})
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* ...existing stats sidebar... */}
            <div className="space-y-6">
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle>Your Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-mood-happy" />
                    <div>
                      <p className="font-medium">{userStats.totalEntries}</p>
                      <p className="text-sm text-muted-foreground">Total entries</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-wellness-green" />
                    <div>
                      <p className="font-medium">{userStats.longestStreak} days</p>
                      <p className="text-sm text-muted-foreground">Longest streak</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className="w-5 h-5 bg-primary" />
                    <div>
                      <p className="font-medium">{userStats.achievements}</p>
                      <p className="text-sm text-muted-foreground">Achievements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Two-Factor Auth
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Login History
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle>Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Trusted contacts who can be notified in case of crisis detection
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Add Emergency Contact
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;