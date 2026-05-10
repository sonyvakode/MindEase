import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  LogOut,
  Mail,
  Lock,
  User as UserIcon,
  X
} from "lucide-react";
import { GlassCard } from "../components/UI/GlassCard";
import { cn } from "../lib/utils";
import { useAuth } from "../components/AuthProvider";

interface LandingProps {
  onNavigate: (tab: string) => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  const { user, login, loginWithEmail, registerWithEmail, logout } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      await login();
      setShowAuthModal(false);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        setAuthError("Login window closed. Please try again.");
      } else {
        setAuthError("Failed to sign in with Google.");
      }
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      setShowAuthModal(false);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setAuthError("Invalid email or password.");
      } else if (error.code === 'auth/email-already-in-use') {
        setAuthError("Email already in use.");
      } else {
        setAuthError("Authentication failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleNavigateWithAuth = (tab: string) => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      onNavigate(tab);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#040D0E] relative overflow-x-hidden flex flex-col items-center">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto w-full bg-dark-bg/50 backdrop-blur-xl border-b border-white/5 sm:bg-transparent sm:backdrop-blur-none sm:border-none">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 purple-gradient rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Heart className="text-white w-5 h-5 sm:w-6 sm:h-6 fill-white" />
          </div>
          <span className="text-lg sm:text-2xl font-bold tracking-tight text-white hidden sm:block">MindEase</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-10 text-white/50 text-xs sm:text-sm font-medium ml-auto">
          <button onClick={() => {
            const el = document.getElementById('about-us');
            el?.scrollIntoView({ behavior: 'smooth' });
          }} className="hover:text-white transition-colors">About</button>
          
          <button onClick={() => handleNavigateWithAuth("community")} className="hover:text-white transition-colors">Community</button>
          
          {user ? (
            <button 
              onClick={logout}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors bg-red-500/5 px-3 py-1.5 rounded-lg border border-red-500/10 hover:bg-red-500/10"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="purple-gradient text-white px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass-card p-8 overflow-hidden"
            >
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <div className="w-12 h-12 purple-gradient rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                  <Heart className="text-white w-6 h-6 fill-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isRegistering ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-sm text-white/40">
                  {isRegistering ? "Join our supportive community today" : "Sign in to continue your journey"}
                </p>
              </div>

              {authError && (
                <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium animate-shake">
                  {authError}
                </div>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-emerald-500/30 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-emerald-500/30 transition-colors"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full purple-gradient py-3.5 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {isRegistering ? "Sign Up" : "Sign In"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                  <span className="bg-[#0A0A0A] px-4 text-white/20">Or continue with</span>
                </div>
              </div>

              <button 
                onClick={handleGoogleLogin}
                className="w-full glass-button py-3 rounded-xl border-white/10 flex items-center justify-center gap-3 hover:bg-white/5 transition-all mb-6"
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                <span className="text-sm font-medium">Google Account</span>
              </button>

              <p className="text-center text-xs text-white/30">
                {isRegistering ? "Already have an account?" : "Don't have an account?"}
                <button 
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="ml-2 text-emerald-400 hover:underline font-bold"
                >
                  {isRegistering ? "Sign In" : "Create one"}
                </button>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-8 pt-20 sm:pt-28 lg:pt-40 pb-2 sm:pb-16 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
          <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter mb-4 lg:mb-8 leading-[0.95] sm:leading-[0.85]">
            You are<br />
            <span className="text-emerald-400">not alone</span>
          </h1>
          <p className="max-w-md mx-auto lg:mx-0 text-sm sm:text-lg text-white/40 mb-6 lg:mb-10 leading-relaxed font-sans px-2 sm:px-0">
            Your mental health matters. We are here to support you every step of the way. 
            Empowering your mind with advanced AI and professional care.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 px-4 sm:px-0">
            <button 
              onClick={() => handleNavigateWithAuth("dashboard")}
              className="w-full sm:w-auto purple-gradient px-10 py-4 rounded-xl font-bold shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all text-sm sm:text-base"
            >
              Get Started
            </button>
            <button 
              onClick={() => handleNavigateWithAuth("chatbot")}
              className="w-full sm:w-auto glass-button border-white/20 px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-sm sm:text-base active:scale-95 transition-all"
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
      <section className="relative z-10 px-8 py-6 sm:py-20 max-w-7xl mx-auto w-full">
        <div className="text-center mb-6 sm:mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-2">What We Offer</h2>
          <div className="w-12 h-1 purple-gradient mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[
            { icon: MessageSquare, title: "AI Chatbot", desc: "Talk to our AI and get instant support", color: "text-blue-400", id: "chatbot" },
            { icon: Smile, title: "Mood Tracker", desc: "Track your daily mood and improve self-awareness", color: "text-yellow-400", id: "mood" },
            { icon: Calendar, title: "Book Appointment", desc: "Connect with professional counsellors", color: "text-purple-400", id: "appointments" },
            { icon: Users, title: "Community", desc: "Share and grow in a safe space", color: "text-indigo-400", id: "community" },
            { icon: LayoutDashboard, title: "Dashboard", desc: "View your progress and analytics", color: "text-blue-400", id: "dashboard" },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleNavigateWithAuth(f.id)}
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

      {/* About Us Section */}
      <section id="about-us" className="relative z-10 px-8 py-6 sm:py-32 max-w-7xl mx-auto w-full border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-8">
          <h2 className="text-4xl font-bold tracking-tight text-white italic">About <span className="text-emerald-400">MindEase</span></h2>
          <p className="text-white/50 text-lg leading-relaxed font-sans">
            MindEase is a dedicated space designed to support your mental journey. 
            We combine clinical wisdom with modern AI technology to provide immediate, 
            compassionate, and personalized care. Our goal is to make mental wellness 
            a seamless part of your daily life, removing barriers and connecting you 
            with the support you deserve.
          </p>
          <div className="pt-4">
            <div className="w-20 h-px bg-white/10 mx-auto" />
          </div>
        </div>
      </section>

      {/* Motivational Quote Card */}
      <section className="relative z-10 px-8 py-6 sm:py-20 w-full max-w-7xl mx-auto">
        <GlassCard className="purple-gradient/10 border-emerald-500/20 text-center py-6 sm:py-12">
           <p className="text-lg lg:text-xl font-serif italic text-emerald-100">
             "Taking care of your mental health is a sign of strength. You deserve to be happy." ❤️
           </p>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/5 pt-8 pb-32 px-8 flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400" />
          <span className="text-sm font-bold text-white uppercase tracking-widest">MindEase</span>
        </div>
        <div className="flex gap-8 text-white/40 text-xs">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] mt-4">© MindEase. Empowering Minds.</p>
      </footer>
    </div>
  );
}
