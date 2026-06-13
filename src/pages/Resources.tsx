import { useState, useEffect } from "react";
import { GlassCard } from "../components/UI/GlassCard";
import { Play, BookOpen, Music, Wind, Clock, Search, ChevronRight } from "lucide-react";
import { api } from "../services/api";
import { Resource } from "../types";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

import Assessments from "./Assessments";

interface ResourcesProps {
  defaultView?: string;
}

export default function Resources({ defaultView }: ResourcesProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filter, setFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"library" | "quizzes">("library");

  useEffect(() => {
    if (defaultView === "quizzes") {
      setActiveTab("quizzes");
    } else {
      setActiveTab("library");
    }
  }, [defaultView]);

  const [loadingResources, setLoadingResources] = useState(true);

  useEffect(() => {
    api.getResources()
      .then(setResources)
      .finally(() => setLoadingResources(false));
  }, []);

  const categories = ["All", "Meditation", "Breathing", "Sleep", "Stress Relief"];

  const filteredResources = filter === "All" 
    ? resources 
    : resources.filter(r => r.category.toLowerCase().includes(filter.toLowerCase()));

  const handleResourceClick = (url: string) => {
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wellness Centre</h1>
          <p className="text-white/40 text-sm font-medium">Guided practices, educational content, and clinical self-screenings.</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("library")}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
              activeTab === "library"
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                : "text-white/40 hover:text-white"
            )}
          >
            Practice Library
          </button>
          <button
            onClick={() => setActiveTab("quizzes")}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
              activeTab === "quizzes"
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                : "text-white/40 hover:text-white"
            )}
          >
            Clinical Quizzes
          </button>
        </div>
      </header>

      {activeTab === "quizzes" ? (
        <Assessments />
      ) : (
        <>
          {/* Practice Library View */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide flex-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={cn(
                     "px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-300 border",
                     filter === c 
                      ? "purple-gradient text-white border-transparent shadow-lg shadow-emerald-500/20" 
                      : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="relative mb-4 md:mb-0 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                placeholder="Search resources..." 
                className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 outline-none focus:border-emerald-500/50 w-full md:w-80 text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {loadingResources ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="glass-card p-4 flex gap-6 items-center animate-pulse">
                    <div className="w-32 h-24 rounded-2xl bg-white/5" />
                    <div className="flex-1 space-y-3">
                      <div className="w-20 h-2 bg-white/5 rounded" />
                      <div className="w-3/4 h-4 bg-white/5 rounded" />
                      <div className="w-24 h-2 bg-white/5 rounded" />
                    </div>
                  </div>
                ))
              ) : filteredResources.length > 0 ? (
                filteredResources.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleResourceClick(r.url || "#")}
                    className="glass-card p-4 flex gap-6 items-center group cursor-pointer hover:border-emerald-500/30 transition-all duration-500"
                  >
                    <div className="w-24 h-24 sm:w-32 sm:h-24 rounded-2xl overflow-hidden shrink-0 relative bg-white/5 border border-white/5">
                      <img src={r.image} alt={r.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" referrerPolicy="no-referrer" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-emerald-500 group-hover:border-emerald-400 group-hover:shadow-lg transition-all">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10B981]" />
                         <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400">{r.category}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold mb-1.5 line-clamp-1 group-hover:text-emerald-400 transition-colors">{r.title}</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/30 uppercase tracking-[0.1em]">
                          <Clock className="w-3 h-3" /> {r.duration}
                        </div>
                      </div>
                    </div>
                    <div className="mr-2">
                       <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all text-white/40">
                          <ChevronRight className="w-4 h-4" />
                       </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                  <BookOpen className="w-12 h-12 text-white/10 mb-4" />
                  <p className="text-white/40 font-medium">No resources found in this category.</p>
                </div>
              )}
            </div>

            <aside className="space-y-8">
               <GlassCard className="p-8 space-y-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Your Top Picks</h3>
                  <div className="space-y-6">
                     {resources.length > 0 ? (
                       resources.slice(0, 2).map((r, i) => (
                          <div key={i} className="flex items-center gap-4 group cursor-pointer" onClick={() => window.open(r.url || "#", "_blank")}>
                             <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                <img src={r.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                             </div>
                             <div className="flex-1">
                                <p className="text-xs font-bold line-clamp-1 group-hover:text-emerald-400 transition-colors">{r.title}</p>
                                <p className="text-[8px] text-white/20 uppercase tracking-widest font-medium mt-0.5">{r.duration} • {r.category}</p>
                             </div>
                          </div>
                       ))
                     ) : (
                       <p className="text-[10px] text-white/20 italic">Loading recommendations...</p>
                     )}
                  </div>
               </GlassCard>

               <GlassCard delay={0.4} className="bg-emerald-500/5 group border-emerald-500/10 p-8 shadow-emerald-500/5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/10 ring-1 ring-white/10">
                    <Wind className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">5-Min Breathing</h3>
                  <p className="text-xs text-white/40 mb-8 font-medium leading-relaxed">Lower cortisol levels and calm your central nervous system instantly with guided box breathing.</p>
                  <button 
                    onClick={() => window.open("https://www.youtube.com/watch?v=acUZdGd_3Dg", "_blank")}
                    className="text-xs font-bold text-emerald-400/60 flex items-center gap-2 group-hover:text-emerald-400 group-hover:gap-3 transition-all"
                   >
                     Explore Guide <ChevronRight className="w-3 h-3" />
                  </button>
               </GlassCard>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
