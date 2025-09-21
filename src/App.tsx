import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/util/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MoodTracking from "./pages/MoodTracking";
import HabitsTracking from "./pages/HabitsTracking";
import Journaling from "./pages/Journaling";
import AICompanion from "./pages/AICompanion";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Achievements from "./pages/Achievements";
import Insights from "./pages/Insights";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Chatbot from "./pages/Chatbot";




const queryClient = new QueryClient();

const App = () => {


  return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mood" element={<MoodTracking />} />
            <Route path="/habits" element={<HabitsTracking />} />
            <Route path="/journal" element={<Journaling />} />



            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/insights" element={<Insights />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
  );
};

export default App;
