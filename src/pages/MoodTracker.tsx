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
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0b1719] border border-white/10 p-4 rounded-2xl shadow-xl space-y-2 text-xs">
        <p className="text-white/40 font-bold uppercase tracking-wider text-[10px]">
          {new Date(data.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
        </p>
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span>
            <span className="text-white font-medium">Mood Score: <strong className="text-[#c084fc] font-bold">{data.score}/10</strong> ({data.mood})</span>
          </div>
          {payload.some((p: any) => p.dataKey === "sleep") && data.sleep !== undefined && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
              <span className="text-white/90">Sleep Score: <strong className="text-[#60a5fa] font-bold">{data.sleep}/10</strong></span>
            </div>
          )}
          {payload.some((p: any) => p.dataKey === "outdoor") && data.actualOutdoor !== undefined && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
              <span className="text-white/90">Outdoor Activity: <strong className="text-[#fbbf24] font-bold">{data.actualOutdoor} mins</strong></span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function MoodTracker({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showSleepMetric, setShowSleepMetric] = useState(false);
  const [outdoorTracked, setOutdoorTracked] = useState(false);
  const [overlaySleep, setOverlaySleep] = useState(false);
  const [overlayOutdoor, setOverlayOutdoor] = useState(false);
  const [profile, setProfile] = useState({ sleepScore: 8, outdoorTime: 30 });

  useEffect(() => {
    api.getMoods().then(data => {
      setMoods([...data].reverse());
    });
  }, []);

  useEffect(() => {
    if (auth.currentUser) {
      getDoc(doc(db, "users", auth.currentUser.uid)).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            sleepScore: data.sleepScore !== undefined ? data.sleepScore : 8,
            outdoorTime: data.outdoorTime !== undefined ? data.outdoorTime : 30
          });
        }
      });
    }
  }, [moods]);

  const moodEmojis = [
    { label: "Happy", emoji: "😊", color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", hoverBg: "hover:bg-emerald-500/10 hover:border-emerald-500/30", shadow: "shadow-emerald-500/30" },
    { label: "Sad", emoji: "😢", color: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", hoverBg: "hover:bg-blue-500/10 hover:border-blue-500/30", shadow: "shadow-blue-500/30" },
    { label: "Anxious", emoji: "😰", color: "bg-indigo-600", text: "text-indigo-600 dark:text-indigo-400", hoverBg: "hover:bg-indigo-600/10 hover:border-indigo-600/30", shadow: "shadow-indigo-600/30" },
    { label: "Tired", emoji: "😴", color: "bg-slate-500", text: "text-slate-600 dark:text-slate-400", hoverBg: "hover:bg-slate-500/10 hover:border-slate-500/30", shadow: "shadow-slate-500/30" },
    { label: "Calm", emoji: "😌", color: "bg-teal-400", text: "text-teal-700 dark:text-teal-300", hoverBg: "hover:bg-teal-400/10 hover:border-teal-400/30", shadow: "shadow-teal-400/30" },
  ];

  const handleMoodSubmit = async (mood: string) => {
    try {
      const score = mood === "Happy" ? 10 : mood === "Sad" ? 3 : mood === "Anxious" ? 5 : mood === "Tired" ? 4 : 8;
      await api.saveMood({ mood, score });
      const updated = await api.getMoods();
      setMoods([...updated].reverse());
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
        <p className="text-slate-500 dark:text-white/40 text-sm">Visualize your emotional journey over time.</p>
      </header>

      <GlassCard delay={0.1} className="p-8">
        <h2 className="text-center text-lg font-bold mb-8 font-sans">How are you feeling today?</h2>
        <div className="flex justify-center flex-wrap gap-4 sm:gap-6 lg:gap-10">
          {moodEmojis.map((m) => {
            const isSelected = selectedMood === m.label;
            return (
              <button
                key={m.label}
                onClick={() => handleMoodSubmit(m.label)}
                className={cn(
                  "group flex flex-col items-center transition-all duration-300",
                  isSelected ? "scale-110" : "hover:scale-105"
                )}
              >
                <div className={cn(
                  "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all border",
                  isSelected 
                    ? `${m.color} ${m.shadow} border-white/35 text-white` 
                    : `bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/15 text-slate-800 dark:text-white/80 ${m.hoverBg}`
                )}>
                  {m.emoji}
                </div>
                <span className={cn(
                  "mt-4 text-[11px] font-bold uppercase tracking-widest transition-colors",
                  isSelected ? `${m.text} font-black` : "text-slate-500 dark:text-white/60 group-hover:text-slate-800 dark:group-hover:text-white font-semibold"
                )}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        {selectedMood ? (
          <div className="mt-8 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fadeIn flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
            Registered your mood: <strong className="uppercase tracking-wider text-white bg-[#6366F1] dark:bg-white/20 px-2 py-0.5 rounded ml-1">{selectedMood}</strong>. Today's entry saved!
          </div>
        ) : (
          <div className="mt-8 text-center text-xs text-slate-500 dark:text-white/50 tracking-wide font-medium">
            💡 Select your current feeling relative to your baseline above to log today's entry.
          </div>
        )}
      </GlassCard>

      <GlassCard delay={0.2} className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <h2 className="text-lg font-bold">Your Mood History</h2>
            <p className="text-slate-500 dark:text-white/40 text-xs mt-1">Overlay sleep scores and outdoor time from your profile to analyze correlations</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setOverlaySleep(!overlaySleep)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                overlaySleep 
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/5 scale-105" 
                  : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-white/80"
              )}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Overlay Sleep ({profile.sleepScore || 8})</span>
            </button>

            <button
              onClick={() => setOverlayOutdoor(!overlayOutdoor)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                overlayOutdoor 
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-500 shadow-lg shadow-amber-500/5 scale-105" 
                  : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-white/80"
              )}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Overlay Outdoor ({profile.outdoorTime || 30}m)</span>
            </button>

            <select className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs px-4 py-2 outline-none font-bold text-slate-700 dark:text-white/60">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={moods.map((m, index) => {
                const moodFactor = (m.score - 5) / 5;
                const charCodeSum = m.id ? m.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) : index;
                const seed = (charCodeSum % 10) / 10 - 0.5;
                
                const sleepVal = Math.min(10, Math.max(1, Math.round(profile.sleepScore + (moodFactor * 2) + seed)));
                const outdoorMinutes = Math.min(480, Math.max(0, Math.round(profile.outdoorTime + (moodFactor * 15) + (seed * 10))));
                const scaledOutdoor = Math.min(10, Math.max(1, Number(((outdoorMinutes / (profile.outdoorTime || 30 || 1)) * 6).toFixed(1))));

                return {
                  ...m,
                  sleep: sleepVal,
                  outdoor: scaledOutdoor,
                  actualOutdoor: outdoorMinutes
                };
              })} 
              margin={{ bottom: 15 }}
            >
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="outdoorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke="var(--chart-text)" 
                fontSize={10} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--chart-text)' }}
                dy={10}
                minTickGap={25}
                tickFormatter={(val) => {
                  try {
                    const d = new Date(val);
                    if (!isNaN(d.getTime())) {
                      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    }
                  } catch (e) {}
                  return val;
                }}
              />
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
                stroke="var(--chart-text)" 
                fontSize={8} 
                axisLine={false} 
                tickLine={false} 
                width={50}
                tick={{ fill: 'var(--chart-text)' }}
              />
              <Tooltip content={<CustomTooltip />} />
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
              {overlaySleep && (
                <Area 
                  type="monotone" 
                  dataKey="sleep" 
                  stroke="#3B82F6" 
                  strokeWidth={2.5} 
                  strokeDasharray="4 4"
                  fill="url(#sleepGradient)"
                  fillOpacity={0.12}
                  animationDuration={1500}
                  dot={{ fill: "#3B82F6", r: 3.5, stroke: "#040D0E", strokeWidth: 1.5 }}
                />
              )}
              {overlayOutdoor && (
                <Area 
                  type="monotone" 
                  dataKey="outdoor" 
                  stroke="#F59E0B" 
                  strokeWidth={2.5} 
                  strokeDasharray="4 4"
                  fill="url(#outdoorGradient)"
                  fillOpacity={0.12}
                  animationDuration={1500}
                  dot={{ fill: "#F59E0B", r: 3.5, stroke: "#040D0E", strokeWidth: 1.5 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-10 pt-8 border-t border-white/5 gap-6 relative">
          <div className="space-y-4 max-w-md">
             <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-white/30">Insights</h3>
             <p className="text-xs text-slate-600 dark:text-white/60 leading-relaxed font-medium">You feel anxious more on exam days.<br />Try meditation and breathing exercises.</p>
          </div>
          
          <div 
            onClick={() => onNavigate?.("resources")}
            className="w-full sm:w-auto p-5 bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200/90 dark:border-indigo-500/40 rounded-2xl flex items-center justify-between sm:justify-start gap-6 group cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-500/30 transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:scale-[1.02] active:scale-[0.98] z-10"
          >
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/30 flex items-center justify-center border border-indigo-200/90 dark:border-indigo-400/30 shadow-inner group-hover:scale-110 transition-transform">
                   <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-300 animate-pulse" />
                </div>
                <div className="flex flex-col text-left">
                   <span className="text-[10px] font-bold tracking-[0.15em] text-indigo-700 dark:text-indigo-300/80 uppercase">AI Recommendation</span>
                   <span className="text-sm font-bold text-indigo-950 dark:text-white tracking-wide">Suggested: Breathing Exercise</span>
                </div>
             </div>
             <ChevronRight className="w-5 h-5 text-indigo-600 dark:text-indigo-300 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard delay={0.3} className="bg-blue-50/50 dark:bg-blue-500/5 group border-blue-100/80 dark:border-blue-500/10">
           <div className="flex justify-between items-start mb-6">
             <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/10">
               <Moon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
             </div>
             <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest bg-blue-100 dark:bg-blue-500/10 px-2 py-1 rounded">Sleep Analysis</span>
           </div>
           <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-white">{showSleepMetric ? "7.5h Average Sleep" : "Steady Sleep Cycle"}</h3>
           <p className="text-xs text-slate-500 dark:text-white/40 mb-6 font-medium leading-relaxed">
             {showSleepMetric 
               ? "Your deep sleep phase increased by 15% after starting evening meditation. Heart rate variability is stable."
               : "Your sleep score averaged 8.2 this week. Consistency is significantly improving your morning mood and cognitive focus."
             }
           </p>
           <button 
             onClick={() => setShowSleepMetric(!showSleepMetric)}
             className="text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all text-slate-500 dark:text-white/60 cursor-pointer"
           >
             {showSleepMetric ? "Hide details" : "View metrics"} <TrendingUp className="w-3 h-3" />
           </button>
        </GlassCard>

        <GlassCard delay={0.4} className="bg-amber-50/50 dark:bg-amber-500/5 group border-amber-100/80 dark:border-amber-500/10">
           <div className="flex justify-between items-start mb-6">
             <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shadow-lg shadow-amber-500/10">
               <Sun className="w-6 h-6 text-amber-600 dark:text-amber-500" />
             </div>
             <span className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest bg-amber-100 dark:bg-amber-500/10 px-2 py-1 rounded">Activity Boost</span>
           </div>
           <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-white">Afternoon Uplift</h3>
           <p className="text-xs text-slate-500 dark:text-white/40 mb-6 font-medium leading-relaxed">10 mins of afternoon sunlight daily increased your serotonin production by 12% this week. Keep it up!</p>
           <button 
             onClick={handleTrackOutdoor}
             disabled={outdoorTracked}
             className={cn(
               "text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer",
               outdoorTracked ? "text-amber-600 dark:text-amber-400" : "text-amber-700 dark:text-amber-500"
             )}
           >
             {outdoorTracked ? "Tracked for today!" : "Track outdoor time"} <Activity className={cn("w-3 h-3", outdoorTracked && "animate-pulse")} />
           </button>
        </GlassCard>
      </div>
    </div>
  );
}
