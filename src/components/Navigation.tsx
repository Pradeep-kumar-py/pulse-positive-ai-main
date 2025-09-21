import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Brain,
  BookOpen,
  MessageCircle,
  Users,
  Trophy,
  BarChart3,
  User,
  Home,

  LogOut,
  HospitalIcon

} from "lucide-react";
import { useAuthStore } from "@/util/AuthContext";

const Navigation = () => {
  const { isAuthenticated, email, name } = useAuthStore();
  const location = useLocation();

  

  const navItems = [
    { path: "/mood", label: "Mood", icon: Heart },
    { path: "/habits", label: "Habits", icon: Brain },
    { path: "/journal", label: "Journal", icon: BookOpen },
    { path: "/community", label: "Community", icon: Users },
    { path: "/achievements", label: "Progress", icon: Trophy },
    // { path: "/insights", label: "Insights", icon: BarChart3 },
    { path: "/companion", label: "Eliza Ai", icon: MessageCircle },

    // { path: "/assesment", label: "Assesment", icon: HospitalIcon },

    // { path: "/chatbot", label: "Chatbot", icon: MessageCircle },
    { path: "/dashboard", label: "Dashboard", icon: Home },
    // { path: "/profile", label: "Profile", icon: User },
  ];

 

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent"
          >
            MindfulSpace
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <Button
                  variant={location.pathname === path ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Icon size={16} />
                  <span className="hidden lg:inline">{label}</span>
                </Button>
              </Link>
            ))}

            <Button>
              <a href="https://mental-health-ai-kohl.vercel.app/">Assessment</a>
            </Button>

            {isAuthenticated && (
              <div className="flex items-center gap-2 pl-3 ml-2 border-l border-border">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 hover:bg-muted transition">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="text-sm font-medium">

                    Welcome {name || email?.split("@")[0] || "User"}

                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <LogOut size={16} />
                  <span className="hidden lg:inline">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;