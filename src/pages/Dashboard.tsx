import { useState, useEffect } from "react";
import { GlassCard } from "../components/UI/GlassCard";
import { 
  TrendingUp, 
  Smile, 
  Calendar, 
  Activity, 
  ArrowUpRight,
  Clock,
  Heart,
  MessageSquare,
  BookOpen
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { api } from "../services/api";
import { WellnessAnalytics, Mood } from "../types";
import { cn } from "../lib/utils";
import { useAuth } from "../components/AuthProvider";

export default function Dashboard({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [data, setData] = useState<WellnessAnalytics | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    api.getAnalytics().then(setData);
    api.getCommunityPosts().then(posts => setRecentPosts(posts.slice(0, 3)));
  }, []);

  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  if (!data) return <div className="flex items-center justify-center h-screen"><div className="w-12 h-12 purple-gradient rounded-full animate-ping opacity-20" /></div>;

  const activityData = [
    { name: "Chatbot", value: 40, color: "#10B981" },
    { name: "Meditation", value: 10, color: "#06B6D4" },
    { name: "Breathing", value: 10, color: "#22C55E" },
    { name: "Articles", value: 15, color: "#EAB308" },
    { name: "Others", value: 25, color: "#14B8A6" },
  ];

  const moodScorePercent = Math.round(data.moodAverage * 10);

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
          <p className="text-white/40 text-sm">Welcome back, {user?.displayName || 'User'}! Here's your wellness summary.</p>
        </div>
        <select className="bg-white/5 border border-white/10 rounded-xl text-xs px-4 py-2 outline-none font-bold text-white/60">
          <option>This Week</option>
          <option>Last Month</option>
        </select>
      </header>

      {/* Main Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="flex items-center gap-6" delay={0.1}>
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 flex items-center justify-center relative shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]">
            <span className="text-xl font-bold">{moodScorePercent}%</span>
            <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent -rotate-45" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-1">Mood Score</p>
            <p className="font-bold text-emerald-400">{data.moodAverage > 7 ? 'Good' : data.moodAverage > 4 ? 'Moderate' : 'Low'}</p>
          </div>
          <div className="ml-auto w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-yellow-500/10">😊</div>
        </GlassCard>

        <GlassCard className="flex items-center gap-6" delay={0.15}>
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400">
            <MessageSquare className="w-6 h-6 outline-none shadow-blue-500/20" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-1">Sessions</p>
            <p className="text-2xl font-bold">{data.totalSessions}</p>
          </div>
          <div className="ml-auto w-10 h-10 bg-blue-400/20 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-blue-500/10">💬</div>
        </GlassCard>

        <GlassCard className="flex items-center gap-6" delay={0.2} onClick={() => onNavigate?.("appointments")}>
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400">
            <Calendar className="w-6 h-6 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-1">Appointments</p>
            <p className="text-2xl font-bold">2</p>
          </div>
          <div className="ml-auto w-10 h-10 bg-emerald-400/20 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-emerald-500/10">🗓️</div>
        </GlassCard>

        <GlassCard className="flex items-center gap-6" delay={0.25} onClick={() => onNavigate?.("resources")}>
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-teal-400">
            <BookOpen className="w-6 h-6 shadow-[0_0_10px_rgba(45,212,191,0.3)]" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-1">Resources Used</p>
            <p className="text-2xl font-bold">7</p>
          </div>
          <div className="ml-auto w-10 h-10 bg-teal-400/20 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-teal-500/10">📚</div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Smile, label: "Log Mood", tab: "mood", bg: "bg-emerald-500/10", text: "text-emerald-400" },
            { icon: MessageSquare, label: "Talk to AI", tab: "chatbot", bg: "bg-blue-500/10", text: "text-blue-400" },
            { icon: Calendar, label: "Book Session", tab: "appointments", bg: "bg-teal-500/10", text: "text-teal-400" },
            { icon: BookOpen, label: "Read Articles", tab: "resources", bg: "bg-white/5", text: "text-white/60" },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => onNavigate?.(action.tab)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all hover:scale-[1.02] active:scale-95 text-left group",
                action.bg
              )}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", action.bg, action.text)}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mood Overview Chart */}
        <GlassCard className="lg:col-span-2" delay={0.3}>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-lg font-bold">Mood Overview</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Sentiment Trend</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.weeklyProgress}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff10" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#061011", border: "1px solid #ffffff05", borderRadius: "12px" }} 
                  itemStyle={{ color: "#fff", fontSize: "12px" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Top Activities Pie Chart */}
        <GlassCard delay={0.4}>
          <h2 className="text-lg font-bold mb-6">Top Activities</h2>
          <div className="relative h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: "#061011", border: "none", borderRadius: "12px" }}
                   itemStyle={{ color: "#fff", fontSize: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-bold">40%</p>
                <p className="text-[8px] uppercase text-white/30 tracking-[0.2em]">Chatbot</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
             {activityData.map((d, i) => (
               <div key={i} className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                 <span className="text-[10px] text-white/40 font-medium">{d.name} ({d.value}%)</span>
               </div>
             ))}
          </div>
        </GlassCard>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Community Activity</h3>
            <button 
              onClick={() => onNavigate?.("community")}
              className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentPosts.length > 0 ? (
              recentPosts.map((post, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 transition-all hover:bg-white/10 group cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white/90 line-clamp-1">{post.text}</p>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest font-medium mt-1">{post.author} • {post.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/20 italic">No recent activity found.</p>
            )}
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 gap-8">
          <GlassCard className="bg-emerald-600/10 border-emerald-500/20 hover:scale-[1.02] cursor-pointer transition-all" onClick={() => onNavigate?.("resources")}>
              <h3 className="text-lg font-bold mb-2">Feeling anxious on exam days?</h3>
              <p className="text-xs text-white/40 mb-6 font-medium">Our data shows a 15% dip in your mood during exam weeks. Try meditation before you start.</p>
              <button className="text-xs font-bold text-emerald-400 flex items-center gap-2 hover:gap-3 transition-all">
                Explore Meditation <ArrowUpRight className="w-3 h-3" />
              </button>
          </GlassCard>
          <GlassCard className="bg-blue-600/10 border-blue-500/20 hover:scale-[1.02] cursor-pointer transition-all" onClick={() => onNavigate?.("appointments")}>
              <h3 className="text-lg font-bold mb-2">Upcoming Session</h3>
              <p className="text-xs text-white/40 mb-6 font-medium">Dr. Rohan Mehta • Clinical Psychologist<br />Today at 4:30 PM • Video Call</p>
              <button className="text-xs font-bold text-blue-400 flex items-center gap-2 hover:gap-3 transition-all">
                Prepare Session <ArrowUpRight className="w-3 h-3" />
              </button>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

// Helper for class names

