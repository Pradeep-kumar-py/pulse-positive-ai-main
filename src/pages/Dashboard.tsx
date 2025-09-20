import { Link } from "react-router-dom";
import react, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Brain, BookOpen, MessageCircle, Users, Trophy } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAuthStore } from "../util/AuthContext";

const Dashboard = () => {

  const { isAuthenticated, name, email } = useAuthStore();
  // Add this to your Navigation component to debug
  console.log('Auth state:', { isAuthenticated, name, email });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Welcome to Your Wellness Journey
            </h1>
            <p className="text-lg text-muted-foreground">Track your mood, build healthy habits, and grow with AI-powered insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-card shadow-card hover:shadow-soft transition-all duration-300 border-0">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-2">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Mood Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">Track your daily emotions and feelings</p>
                <Link to="/mood">
                  <Button className="w-full bg-gradient-primary hover:opacity-90">Track Mood</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card hover:shadow-soft transition-all duration-300 border-0">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-wellness rounded-full flex items-center justify-center mb-2">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Habits</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">Build healthy daily routines</p>
                <Link to="/habits">
                  <Button variant="secondary" className="w-full">View Habits</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card hover:shadow-soft transition-all duration-300 border-0">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-calm rounded-full flex items-center justify-center mb-2">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Journal</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">Reflect on your thoughts and experiences</p>
                <Link to="/journal">
                  <Button variant="outline" className="w-full">Write Entry</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card hover:shadow-soft transition-all duration-300 border-0">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-2">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle>AI Companion</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">Chat with your supportive AI guide</p>
                <Link to="/companion">
                  <Button className="w-full bg-gradient-primary hover:opacity-90">Start Chat</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card hover:shadow-soft transition-all duration-300 border-0">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-wellness rounded-full flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">Connect with others on similar journeys</p>
                <Link to="/community">
                  <Button variant="secondary" className="w-full">Join Community</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card hover:shadow-soft transition-all duration-300 border-0">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-calm rounded-full flex items-center justify-center mb-2">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">Celebrate your progress and milestones</p>
                <Link to="/achievements">
                  <Button variant="outline" className="w-full">View Progress</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;