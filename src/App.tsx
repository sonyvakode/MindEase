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
  const { user, loading, login } = useAuth();
  const [activeTab, setActiveTab] = useState("landing");
  const [navState, setNavState] = useState<any>(null);

  useEffect(() => {
    if (!loading && user) {
      seedDatabase();
    }
  }, [loading, user]);

  const handleNavigate = async (tab: string, state?: any) => {
    // Protected routes
    const protectedTabs = ["dashboard", "mood", "appointments", "community", "chatbot", "profile"];
    if (protectedTabs.includes(tab) && !user) {
      try {
        await login();
        setActiveTab(tab);
        setNavState(state || null);
      } catch (e) {
        console.error("Login cancelled", e);
      }
      return;
    }
    setActiveTab(tab);
    setNavState(state || null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "landing": return <Landing onNavigate={handleNavigate} />;
      case "dashboard": return <Dashboard onNavigate={handleNavigate} />;
      case "chatbot": return <Chatbot specialist={navState?.specialist} />;
      case "mood": return <MoodTracker onNavigate={handleNavigate} />;
      case "appointments": return <Appointments onNavigate={handleNavigate} />;
      case "resources": return <Resources />;
      case "community": return <Community />;
      case "profile": return <Profile />;
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
    <div className="min-h-screen bg-[#040D0E] relative overflow-hidden flex">
      <div className="atmosphere" />
      
      {!isLanding && <Sidebar activeTab={activeTab} setActiveTab={handleNavigate} />}

      <main className={cn(
        "flex-1 min-h-screen relative z-10 overflow-y-auto",
        !isLanding ? "ml-20 lg:ml-64 p-4 lg:p-8" : ""
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={cn(isLanding ? "w-full" : "max-w-7xl mx-auto")}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
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
