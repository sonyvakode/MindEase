import { useState, useEffect } from "react";
import Sidebar from "./components/Layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import MoodTracker from "./pages/MoodTracker";
import Appointments from "./pages/Appointments";
import Resources from "./pages/Resources";
import Community from "./pages/Community";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import { seedDatabase } from "./services/seed";

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("landing");
  const [navState, setNavState] = useState<any>(null);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("theme") as "dark" | "light") || "dark";
  });

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Effect to redirect and seed data
  useEffect(() => {
    if (!loading) {
      if (user) {
        // Run seed once on login
        seedDatabase();
        // Redirect to dashboard ONLY IF we are on landing and haven't redirected this session
        if (activeTab === "landing" && !hasRedirected) {
          setActiveTab("dashboard");
          setHasRedirected(true);
        }
      } else {
        // Not logged in: reset redirection and force landing if trying to access protected areas
        setHasRedirected(false);
        if (activeTab !== "landing") {
          setActiveTab("landing");
        }
      }
    }
  }, [loading, user, hasRedirected, activeTab]);

  const handleNavigate = (tab: string, state?: any) => {
    setActiveTab(tab);
    setNavState(state || null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "landing": return <Landing onNavigate={handleNavigate} theme={theme} onToggleTheme={toggleTheme} />;
      case "dashboard": return <Dashboard onNavigate={handleNavigate} />;
      case "chatbot": return <Chatbot specialist={navState?.specialist} bookedAdvisorMode={navState?.bookedAdvisorMode} />;
      case "mood": return <MoodTracker onNavigate={handleNavigate} />;
      case "appointments": return <Appointments onNavigate={handleNavigate} />;
      case "resources": return <Resources defaultView={navState?.view} />;
      case "community": return <Community />;
      case "profile": return <Profile onNavigate={handleNavigate} />;
      case "admin": return <Admin />;
      default: return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  const isLanding = activeTab === "landing";

  if (loading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center transition-colors duration-300", theme === "light" ? "light bg-[#F3F6F5]" : "bg-[#040D0E]")}>
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen relative flex flex-col md:flex-row transition-colors duration-300", theme === "light" ? "light bg-[#F3F6F5] text-slate-900" : "bg-[#040D0E] text-white")}>
      <div className="atmosphere" />
      
      {!isLanding && <Sidebar activeTab={activeTab} setActiveTab={handleNavigate} theme={theme} onToggleTheme={toggleTheme} />}

      <main className={cn(
        "flex-1 min-h-screen relative z-10 overflow-x-hidden",
        !isLanding ? "md:pl-20 lg:pl-64 pb-20 md:pb-0" : ""
      )}>
        <div className={cn(
          "h-full",
          !isLanding ? (activeTab === "chatbot" ? "p-2 sm:p-4 lg:p-8" : "p-4 sm:p-6 lg:p-8") : ""
        )}>
          <div className={cn(isLanding ? "w-full" : "max-w-7xl mx-auto h-full")}>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
