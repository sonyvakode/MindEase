import { useState } from "react";
import { GlassCard } from "../components/UI/GlassCard";
import { Users, Calendar, TrendingUp, AlertCircle, Search, ShieldCheck } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { cn } from "../lib/utils";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");

  const pieData = [
    { name: "Anxious", value: 35 },
    { name: "Happy", value: 45 },
    { name: "Stressed", value: 20 },
  ];
  const COLORS = ["#8B5CF6", "#10B981", "#EF4444"];

  const barData = [
    { name: "Mon", users: 120, sessions: 450 },
    { name: "Tue", users: 150, sessions: 520 },
    { name: "Wed", users: 180, sessions: 610 },
    { name: "Thu", users: 140, sessions: 480 },
    { name: "Fri", users: 210, sessions: 700 },
    { name: "Sat", users: 250, sessions: 850 },
    { name: "Sun", users: 190, sessions: 640 },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Intelligence</h1>
          <p className="text-white/60">Platform health and population wellness metrics.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span className="text-xs font-bold text-green-400">System Secure</span>
          </div>
        </div>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Users", value: "12.4k", icon: Users },
          { label: "AI Conversations", value: "48.2k", icon: TrendingUp },
          { label: "Avg Mood Score", value: "7.2/10", icon: TrendingUp },
          { label: "Pending Reviews", value: "14", icon: AlertCircle },
        ].map((s, i) => (
          <GlassCard key={i} delay={i * 0.05}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 glass-button p-0 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-white/40">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Traffic Chart */}
        <GlassCard className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-8">User Activity</h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff20" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: "#1e1b4b", border: "none", borderRadius: "12px" }}
                   cursor={{ fill: '#ffffff05' }}
                />
                <Bar dataKey="users" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sessions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Mood Distribution */}
        <GlassCard>
          <h2 className="text-xl font-bold mb-8">Mood Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1e1b4b", border: "none", borderRadius: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
             {pieData.map((d, i) => (
               <div key={i} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2 text-white/60">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                   {d.name}
                 </div>
                 <span className="font-bold">{d.value}%</span>
               </div>
             ))}
          </div>
        </GlassCard>
      </div>

      {/* Recent Appointments Table */}
      <GlassCard>
         <div className="flex items-center justify-between mb-8">
           <h2 className="text-xl font-bold">Recent Appointments</h2>
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
             <input placeholder="Search..." className="glass-button pl-9 text-xs py-1.5" />
           </div>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead className="text-xs uppercase tracking-widest text-white/20 border-b border-white/10">
               <tr>
                 <th className="px-4 py-4 font-medium">User</th>
                 <th className="px-4 py-4 font-medium">Expert</th>
                 <th className="px-4 py-4 font-medium">Date</th>
                 <th className="px-4 py-4 font-medium">Session Type</th>
                 <th className="px-4 py-4 font-medium">Status</th>
               </tr>
             </thead>
             <tbody className="text-sm text-white/80">
               {[
                 { user: "Alex T.", expert: "Dr. Sarah J.", date: "Today, 10:00 AM", type: "Video Call", status: "Ongoing" },
                 { user: "Emma W.", expert: "Michael C.", date: "Today, 02:30 PM", type: "Chat", status: "Scheduled" },
                 { user: "David K.", expert: "Emily R.", date: "Yesterday", type: "Voice Call", status: "Completed" },
               ].map((row, i) => (
                 <tr key={i} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                   <td className="px-4 py-4 font-medium">{row.user}</td>
                   <td className="px-4 py-4 text-purple-400">{row.expert}</td>
                   <td className="px-4 py-4 text-white/40">{row.date}</td>
                   <td className="px-4 py-4">{row.type}</td>
                   <td className="px-4 py-4">
                     <span className={cn(
                       "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                       row.status === "Completed" ? "bg-green-500/10 text-green-400" :
                       row.status === "Ongoing" ? "bg-blue-500/10 text-blue-400" :
                       "bg-purple-500/10 text-purple-400"
                     )}>
                       {row.status}
                     </span>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </GlassCard>
    </div>
  );
}


