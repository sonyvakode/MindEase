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
      case "landing": return <Landing onNavigate={handleNavigate} />;
      case "dashboard": return <Dashboard onNavigate={handleNavigate} />;
      case "chatbot": return <Chatbot onNavigate={handleNavigate} navigationState={navState} />;
      case "mood": return <MoodTracker onNavigate={handleNavigate} />;
      case "appointments": return <Appointments onNavigate={handleNavigate} />;
      case "resources": return <Resources />;
      case "community": return <Community />;
      case "profile": return <Profile onNavigate={handleNavigate} />;
      case "admin": return <Admin />;
      default: return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  const isLanding = activeTab === "landing";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040D0E] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040D0E] relative flex flex-col md:flex-row">
      <div className="atmosphere" />
      
      {!isLanding && <Sidebar activeTab={activeTab} setActiveTab={handleNavigate} />}

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
