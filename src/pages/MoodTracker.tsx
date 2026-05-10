import { useState, useEffect } from "react";
import { GlassCard } from "../components/UI/GlassCard";
import { 
  Heart, 
  Activity, 
  ChevronRight,
  TrendingUp,
  Brain,
  Moon,
  Sun
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { api } from "../services/api";
import { Mood } from "../types";
import { cn } from "../lib/utils";

export default function MoodTracker({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showSleepMetric, setShowSleepMetric] = useState(false);
  const [outdoorTracked, setOutdoorTracked] = useState(false);

  useEffect(() => {
    api.getMoods().then(setMoods);
  }, []);

  const moodEmojis = [
    { label: "Happy", emoji: "😊", color: "bg-emerald-500", shadow: "shadow-emerald-500/20" },
    { label: "Sad", emoji: "😢", color: "bg-blue-500", shadow: "shadow-blue-500/20" },
    { label: "Anxious", emoji: "😰", color: "bg-teal-600", shadow: "shadow-teal-500/20" },
    { label: "Tired", emoji: "😴", color: "bg-slate-500", shadow: "shadow-slate-500/20" },
    { label: "Calm", emoji: "😌", color: "bg-emerald-400", shadow: "shadow-emerald-400/20" },
  ];

  const handleMoodSubmit = async (mood: string) => {
    try {
      const score = mood === "Happy" ? 10 : mood === "Sad" ? 3 : mood === "Anxious" ? 5 : mood === "Tired" ? 4 : 8;
      await api.saveMood({ mood, score });
      const updated = await api.getMoods();
      setMoods(updated);
      setSelectedMood(mood);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTrackOutdoor = () => {
    setOutdoorTracked(true);
    setTimeout(() => setOutdoorTracked(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Mood Tracker</h1>
        <p className="text-white/40 text-sm">Visualize your emotional journey over time.</p>
      </header>

      <GlassCard delay={0.1} className="p-8">
        <h2 className="text-center text-lg font-bold mb-8 font-sans">How are you feeling today?</h2>
        <div className="flex justify-center flex-wrap gap-4 sm:gap-6 lg:gap-10">
          {moodEmojis.map((m) => (
            <button
              key={m.label}
              onClick={() => handleMoodSubmit(m.label)}
              className={cn(
                "group flex flex-col items-center transition-all duration-300",
                selectedMood === m.label ? "scale-110" : "hover:scale-105"
              )}
            >
              <div className={cn(
                "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all border border-white/5",
                selectedMood === m.label 
                  ? `${m.color} ${m.shadow} border-white/20` 
                  : "bg-white/5 hover:bg-white/10"
              )}>
                {m.emoji}
              </div>
              <span className={cn(
                "mt-4 text-[10px] font-bold uppercase tracking-widest transition-colors",
                selectedMood === m.label ? "text-white" : "text-white/30 group-hover:text-white/60"
              )}>
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard delay={0.2} className="p-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-lg font-bold">Your Mood History</h2>
          <select className="bg-white/5 border border-white/10 rounded-xl text-xs px-4 py-2 outline-none font-bold text-white/60">
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={moods}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#ffffff10" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis 
                domain={[0, 10]} 
                ticks={[2, 4, 6, 8, 10]} 
                tickFormatter={(val) => {
                  if (val === 10) return "Happy";
                  if (val === 8) return "Calm";
                  if (val === 6) return "Neutral";
                  if (val === 4) return "Sad";
                  if (val === 2) return "Anxious";
                  return "";
                }}
                stroke="#ffffff10" 
                fontSize={8} 
                axisLine={false} 
                tickLine={false} 
                width={50}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#061011", border: "1px solid #ffffff10", borderRadius: "12px" }}
                itemStyle={{ color: "#fff", fontSize: "12px" }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#8B5CF6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#moodGradient)" 
                animationDuration={2000}
                dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4, stroke: "#040D0E" }}
                activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2, fill: "white" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-10 pt-8 border-t border-white/5 gap-6 relative">
          <div className="space-y-4 max-w-md">
             <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Insights</h3>
             <p className="text-xs text-white/60 leading-relaxed font-medium">You feel anxious more on exam days.<br />Try meditation and breathing exercises.</p>
          </div>
          <div className="hidden lg:block absolute bottom-0 right-0 w-48 h-48 pointer-events-none opacity-60">
             <img 
               src="https://img.freepik.com/free-vector/vector-illustration-woman-sitting-lotus-position_1284-42777.jpg" 
               className="w-full h-full object-contain mix-blend-screen"
               alt="Meditation"
             />
          </div>
          <div 
            onClick={() => onNavigate?.("resources")}
            className="w-full sm:w-auto p-4 bg-emerald-500/10 border border-emerald-500/20 py-3 px-6 rounded-2xl flex items-center justify-between sm:justify-start gap-4 group cursor-pointer hover:bg-emerald-500/20 transition-all z-10"
          >
             <div className="flex items-center gap-4">
                <Brain className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-white/80">Suggested: Breathing Exercise</span>
             </div>
             <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard delay={0.3} className="bg-blue-500/5 group border-blue-500/10">
           <div className="flex justify-between items-start mb-6">
             <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/10">
               <Moon className="w-6 h-6 text-blue-400" />
             </div>
             <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded">Sleep Analysis</span>
           </div>
           <h3 className="text-lg font-bold mb-2">{showSleepMetric ? "7.5h Average Sleep" : "Steady Sleep Cycle"}</h3>
           <p className="text-xs text-white/40 mb-6 font-medium leading-relaxed">
             {showSleepMetric 
               ? "Your deep sleep phase increased by 15% after starting evening meditation. Heart rate variability is stable."
               : "Your sleep score averaged 8.2 this week. Consistency is significantly improving your morning mood and cognitive focus."
             }
           </p>
           <button 
             onClick={() => setShowSleepMetric(!showSleepMetric)}
             className="text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all text-white/60 cursor-pointer"
           >
             {showSleepMetric ? "Hide details" : "View metrics"} <TrendingUp className="w-3 h-3" />
           </button>
        </GlassCard>

        <GlassCard delay={0.4} className="bg-emerald-500/5 group border-emerald-500/10">
           <div className="flex justify-between items-start mb-6">
             <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/10">
               <Sun className="w-6 h-6 text-emerald-500" />
             </div>
             <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">Activity Boost</span>
           </div>
           <h3 className="text-lg font-bold mb-2">Afternoon Uplift</h3>
           <p className="text-xs text-white/40 mb-6 font-medium leading-relaxed">10 mins of afternoon sunlight daily increased your serotonin production by 12% this week. Keep it up!</p>
           <button 
             onClick={handleTrackOutdoor}
             disabled={outdoorTracked}
             className={cn(
               "text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer",
               outdoorTracked ? "text-emerald-400" : "text-emerald-500"
             )}
           >
             {outdoorTracked ? "Tracked for today!" : "Track outdoor time"} <Activity className={cn("w-3 h-3", outdoorTracked && "animate-pulse")} />
           </button>
        </GlassCard>
      </div>
    </div>
  );
}
