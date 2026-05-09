import { motion } from "motion/react";
import { 
  Heart, 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  LayoutDashboard,
  Calendar,
  BookOpen,
  Users,
  Activity,
  Smile,
  LogOut
} from "lucide-react";
import { GlassCard } from "../components/UI/GlassCard";
import { cn } from "../lib/utils";
import { useAuth } from "../components/AuthProvider";

interface LandingProps {
  onNavigate: (tab: string) => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  const { user, login, logout } = useAuth();
  
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 purple-gradient rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Heart className="text-white w-6 h-6 fill-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white hidden sm:block">MindEase</span>
        </div>
        <div className="flex items-center gap-6 sm:gap-10 text-white/50 text-sm font-medium">
          <button onClick={() => onNavigate("landing")} className="hover:text-white transition-colors">Home</button>
          <button onClick={() => onNavigate("resources")} className="hover:text-white transition-colors">Resources</button>
          <button onClick={() => onNavigate("community")} className="hover:text-white transition-colors">Community</button>
          
          {user ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onNavigate("dashboard")}
                className="flex items-center gap-2 bg-white/5 p-1 px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/10 transition-all font-bold text-xs text-white"
              >
                <img src={user.photoURL || ""} className="w-6 h-6 rounded-lg ring-1 ring-emerald-500/50" alt="P" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button 
                onClick={logout}
                className="w-9 h-9 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="purple-gradient text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-8 pt-32 pb-20 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
          <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
            You are<br />
            <span className="text-emerald-400">not alone</span>
          </h1>
          <p className="max-w-lg mx-auto lg:mx-0 text-lg text-white/40 mb-10 leading-relaxed font-sans">
            Your mental health matters. We are here to support you every step of the way. 
            Empowering your mind with advanced AI and professional care.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button 
              onClick={() => onNavigate("dashboard")}
              className="w-full sm:w-auto purple-gradient px-8 py-3.5 rounded-xl font-bold shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all"
            >
              Get Started
            </button>
            <button 
              onClick={() => onNavigate("chatbot")}
              className="w-full sm:w-auto glass-button border-white/20 px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              Talk to AI
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 relative"
        >
          <div className="relative z-10 w-full aspect-square max-w-[550px] mx-auto overflow-hidden rounded-[3rem] p-1 bg-gradient-to-b from-emerald-500/20 to-transparent border border-white/10 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
             <img 
               src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80" 
               alt="Peaceful Mind Illustration" 
               className="w-full h-full object-cover opacity-90 contrast-[1.1] brightness-[1.1]"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-80" />
          </div>
          {/* Glowing element behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-emerald-500/10 rounded-full blur-[120px] -z-10" />
        </motion.div>
      </section>

      {/* What We Offer */}
      <section className="relative z-10 px-8 py-20 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-2">What We Offer</h2>
          <div className="w-12 h-1 purple-gradient mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { icon: MessageSquare, title: "AI Chatbot", desc: "Talk to our AI and get instant support", color: "text-blue-400", id: "chatbot" },
            { icon: Smile, title: "Mood Tracker", desc: "Track your daily mood and improve self-awareness", color: "text-yellow-400", id: "mood" },
            { icon: Calendar, title: "Book Appointment", desc: "Connect with professional counsellors", color: "text-purple-400", id: "appointments" },
            { icon: BookOpen, title: "Wellness Resources", desc: "Explore videos, exercises and articles", color: "text-green-400", id: "resources" },
            { icon: Users, title: "Community", desc: "Share and grow in a safe space", color: "text-indigo-400", id: "community" },
            { icon: LayoutDashboard, title: "Dashboard", desc: "View your progress and analytics", color: "text-blue-400", id: "dashboard" },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onNavigate(f.id)}
              className="glass-card p-6 flex flex-col items-center text-center group cursor-pointer hover:border-emerald-500/30"
            >
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:purple-gradient group-hover:text-white transition-all shadow-lg border border-white/5">
                <f.icon className={cn("w-6 h-6 transition-colors group-hover:text-white", f.color)} />
              </div>
              <h3 className="text-sm font-bold mb-2">{f.title}</h3>
              <p className="text-[10px] text-white/30 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Motivational Quote Card */}
      <section className="relative z-10 px-8 py-20 w-full max-w-7xl mx-auto">
        <GlassCard className="purple-gradient/10 border-emerald-500/20 text-center py-12">
           <p className="text-lg lg:text-xl font-serif italic text-emerald-100">
             "Taking care of your mental health is a sign of strength. You deserve to be happy." ❤️
           </p>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/5 pt-12 pb-12 px-8 flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400" />
          <span className="text-sm font-bold text-white uppercase tracking-widest">MindEase</span>
        </div>
        <div className="flex gap-8 text-white/40 text-xs">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] mt-4">© 2026 MindEase Platform. Empowering Minds.</p>
      </footer>
    </div>
  );
}
