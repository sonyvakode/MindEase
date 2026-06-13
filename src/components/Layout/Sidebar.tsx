import { motion } from "motion/react";
import { 
  BarChart3, 
  MessageSquare, 
  User, 
  Calendar, 
  BookOpen, 
  Users, 
  LayoutDashboard,
  LogOut,
  Heart,
  Home,
  Settings,
  Sun,
  Moon,
  Award
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../AuthProvider";

const menuItems = [
  { id: "landing", icon: Home, label: "Home" },
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "chatbot", icon: MessageSquare, label: "AI" },
  { id: "appointments", icon: Calendar, label: "Apps" },
  { id: "community", icon: Users, label: "Community" },
  { id: "resources", icon: BookOpen, label: "Resources" },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, theme, onToggleTheme }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed left-0 top-0 h-screen w-20 lg:w-64 bg-black/20 backdrop-blur-3xl border-r border-white/5 p-4 hidden md:flex flex-col z-50"
      >
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => setActiveTab("landing")}>
          <div className="w-10 h-10 purple-gradient rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Heart className="text-white w-6 h-6 fill-white" />
          </div>
          <h1 className="text-xl font-bold font-sans hidden lg:block tracking-tight text-white group-hover:text-emerald-400 transition-colors">MindEase</h1>
        </div>

        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => (
            <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={cn(
                 "w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative",
                 activeTab === item.id 
                   ? (theme === "light" 
                       ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                       : "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20") 
                   : (theme === "light" 
                       ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900" 
                       : "text-white/40 hover:bg-white/5 hover:text-white")
               )}
            >
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full shadow-[0_0_10px_#10B981]"
                />
              )}
              <item.icon className={cn(
                 "w-5 h-5 min-w-[20px] transition-colors",
                 activeTab === item.id 
                   ? (theme === "light" ? "text-emerald-700" : "text-emerald-400") 
                   : (theme === "light" ? "text-slate-500 group-hover:text-slate-900" : "group-hover:text-white")
              )} />
              <span className="font-medium hidden lg:block text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-1.5 pt-6 border-t border-white/5">
          <button 
            onClick={onToggleTheme}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all text-sm"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <>
                <Moon className="w-5 h-5 min-w-[20px] text-emerald-600" />
                <span className="font-medium hidden lg:block text-sm text-emerald-600">Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-5 h-5 min-w-[20px] text-yellow-400" />
                <span className="font-medium hidden lg:block text-sm text-white">Light Mode</span>
              </>
            )}
          </button>
          {user && (
            <div 
              onClick={() => setActiveTab("profile")}
              className={cn(
                "flex items-center gap-3 p-3 mb-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer transition-all hover:bg-white/10",
                activeTab === "profile" && "border-emerald-500/50 bg-emerald-500/5 shadow-lg shadow-emerald-500/10"
              )}
            >
              <img 
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=10B981&color=fff`} 
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30" 
                alt="Profile"
              />
              <div className="hidden lg:block min-w-0">
                <p className="text-[10px] font-bold text-white truncate uppercase tracking-widest">{user.displayName || 'Patient'}</p>
                <p className="text-[8px] text-white/30 truncate uppercase tracking-tighter">Verified Member</p>
              </div>
            </div>
          )}
          <button 
            onClick={() => setActiveTab("profile")}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all text-sm"
          >
            <Settings className="w-5 h-5 min-w-[20px]" />
            <span className="font-medium hidden lg:block text-sm">Settings</span>
          </button>
          <button 
            onClick={async () => { 
              if (window.confirm("Sign out of MindEase?")) {
                await logout(); 
                setActiveTab("landing"); 
              }
            }}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5 min-w-[20px]" />
            <span className="font-medium hidden lg:block text-sm">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Floating Theme Toggle */}
      <button
        onClick={onToggleTheme}
        className="fixed top-4 right-4 z-[100] w-10 h-10 md:hidden bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center text-white shadow-xl active:scale-95 transition-all"
        title="Toggle Theme"
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5 text-emerald-600" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-400" />
        )}
      </button>

      {/* Mobile Bottom Navbar */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-50 backdrop-blur-3xl border-t px-1 py-2 md:hidden flex items-center justify-between pb-safe transition-colors duration-300", 
        theme === "light" ? "bg-white/95 border-emerald-500/10 text-slate-800" : "bg-[#061011]/95 border-white/10 text-white"
      )}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 flex-1 transition-all",
              activeTab === item.id 
                ? (theme === "light" ? "text-emerald-600" : "text-emerald-400") 
                : (theme === "light" ? "text-slate-400 hover:text-slate-600" : "text-white/30 hover:text-white")
            )}
          >
            <item.icon className={cn("w-5 h-5", activeTab === item.id && (theme === "light" ? "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "drop-shadow-[0_0_8px_#10B981]"))} />
            <span className="text-[10px] font-bold uppercase tracking-tight">
              {item.label === "Home" ? "Home" : 
               item.label === "Dashboard" ? "Dash" :
               item.label === "AI" ? "AI" :
               item.label === "Apps" ? "Appts" : "Comm"}
            </span>
          </button>
        ))}
        <button
          onClick={() => setActiveTab("profile")}
          className={cn(
            "flex flex-col items-center gap-1 flex-1 transition-all",
            activeTab === "profile" 
              ? (theme === "light" ? "text-emerald-600" : "text-emerald-400") 
              : (theme === "light" ? "text-slate-400 hover:text-slate-600" : "text-white/30 hover:text-white")
          )}
        >
          {user?.photoURL ? (
            <img src={user.photoURL} className={cn("w-5 h-5 rounded-full object-cover", activeTab === "profile" ? "ring-1 ring-emerald-500" : "ring-1 ring-white/10")} alt="P" />
          ) : (
            <User className="w-5 h-5" />
          )}
          <span className="text-[10px] font-bold uppercase tracking-tight">Me</span>
        </button>
      </nav>
    </>
  );
}
