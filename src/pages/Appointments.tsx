import { useState, useEffect } from "react";
import { GlassCard } from "../components/UI/GlassCard";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Star, 
  ShieldCheck,
  User,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Info,
  MessageSquare
} from "lucide-react";
import { api } from "../services/api";
import { Specialist, Appointment } from "../types";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function Appointments({ onNavigate }: { onNavigate?: (tab: string, state?: any) => void }) {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [selectedDate, setSelectedDate] = useState<number>(17);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null);
  const [viewingSpecialist, setViewingSpecialist] = useState<Specialist | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    api.getSpecialists().then(setSpecialists);

    // Real-time listener for appointments
    const unsubscribe = api.subscribeToAppointments((appointments) => {
      setMyAppointments(appointments);
    });

    return () => unsubscribe();
  }, []);

  const timeSlots = ["10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

  const handleBook = async () => {
    if (!selectedSpecialist || !selectedTime) {
      alert("Please select a specialist and a time slot.");
      return;
    }

    setIsBooking(true);
    try {
      await api.bookAppointment({
        specialistId: selectedSpecialist.id,
        specialistName: selectedSpecialist.name,
        date: `2026-05-${selectedDate.toString().padStart(2, '0')}`,
        time: selectedTime
      });
      setBooked(true);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelRequest = (appt: Appointment) => {
    setCancellingAppointment(appt);
  };

  const confirmCancel = async () => {
    if (!cancellingAppointment) return;
    setIsCancelling(true);
    try {
      await api.cancelAppointment(cancellingAppointment.id);
      setCancellingAppointment(null);
    } catch (error) {
      console.error("Cancel error:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleJoinSession = (appt: Appointment) => {
    const specialistInfo = specialists.find(s => s.id === appt.specialistId);
    onNavigate?.("chatbot", { specialist: specialistInfo });
  };

  if (booked) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400"
        >
          <ShieldCheck className="w-10 h-10 shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
        </motion.div>
        <h2 className="text-3xl font-bold tracking-tight">Appointment Booked!</h2>
        <p className="text-white/40 max-w-md font-medium leading-relaxed">Your session with {selectedSpecialist?.name} has been scheduled for May {selectedDate} at {selectedTime}.</p>
        <button 
          onClick={() => setBooked(false)}
          className="purple-gradient px-8 py-3 rounded-xl font-bold text-white shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
        >
          Book Another
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Book an Appointment</h1>
        <p className="text-white/40 text-sm font-medium">Connect with verified mental health professionals for expert care.</p>
      </header>

      <AnimatePresence>
        {myAppointments.length > 0 && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4"
          >
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">Scheduled Sessions</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {myAppointments.map((appt) => (
                <GlassCard key={appt.id} className="min-w-[320px] p-4 flex items-center gap-4 border-emerald-500/20 bg-emerald-500/5 group relative">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                    <Video className="w-6 h-6 text-emerald-400 shadow-teal-500/20" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-white">{appt.specialistName}</p>
                      <button 
                        onClick={() => handleCancelRequest(appt)}
                        className="text-[8px] text-red-400 hover:text-red-300 font-bold uppercase tracking-widest transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[10px] text-white/40 font-medium">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          <span>{appt.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{appt.time}</span>
                        </div>
                      </div>
                      <span className={cn(
                        "text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest",
                        appt.status === 'confirmed' ? "bg-green-500/20 text-green-400" :
                        appt.status === 'cancelled' ? "bg-red-500/20 text-red-400" :
                        appt.status === 'completed' ? "bg-blue-500/20 text-blue-400" :
                        "bg-yellow-500/20 text-yellow-500"
                      )}>
                        {appt.status}
                      </span>
                    </div>
                    {appt.status === 'confirmed' && (
                      <button 
                        onClick={() => handleJoinSession(appt)}
                        className="w-full mt-2 bg-emerald-500/20 hover:bg-emerald-500 border border-emerald-500/30 py-2 rounded-lg text-[9px] font-bold text-emerald-400 hover:text-white uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Join Session
                      </button>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Counselor Selection */}
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-6">Choose Counsellor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {specialists.slice(0, 5).map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedSpecialist(s)}
                  className={cn(
                    "glass-card p-4 pb-6 cursor-pointer group hover:border-emerald-500/50 shadow-2xl transition-all duration-300",
                    selectedSpecialist?.id === s.id ? "border-emerald-500 bg-emerald-500/5" : ""
                  )}
                >
                  <div className="relative mb-5">
                    <img 
                      src={s.image} 
                      alt={s.name} 
                      className="w-full aspect-[4/5] object-cover rounded-2xl grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 ring-1 ring-white/5" 
                    />
                    <div className="absolute top-2 right-2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg flex items-center gap-1.5 border border-white/5">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-bold text-white tracking-widest">{s.rating || '4.8'}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingSpecialist(s);
                      }}
                      className="absolute bottom-2 right-2 w-8 h-8 bg-white/10 hover:bg-emerald-500 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10 transition-all group-hover:scale-110 active:scale-95"
                    >
                      <Info className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-sm mb-1 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{s.name}</h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">{s.specialty}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Date & Slot Selection */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <GlassCard className="p-6 border-white/5">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Select Date</h3>
                   <div className="flex items-center gap-3">
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-xl transition-colors"><ChevronLeft className="w-4 h-4 text-white/40" /></button>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">May Journey</span>
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-xl transition-colors"><ChevronRight className="w-4 h-4 text-white/40" /></button>
                   </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2 text-center mb-6">
                   {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                     <span key={d} className="text-[8px] font-bold text-white/20 uppercase tracking-[0.1em]">{d}</span>
                   ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 31 }, (_, i) => {
                      const day = i + 1;
                      const isSelected = day === selectedDate;
                      return (
                        <button 
                         key={i} 
                         onClick={() => setSelectedDate(day)}
                         className={cn(
                           "aspect-square rounded-xl flex items-center justify-center text-[11px] font-bold transition-all relative group",
                           isSelected ? "purple-gradient text-white shadow-xl shadow-emerald-500/30 scale-105" : "hover:bg-white/10 text-white/40"
                         )}
                        >
                         {day}
                         {day === 10 && <div className="absolute bottom-1.5 w-1 h-1 bg-emerald-500 rounded-full" />}
                        </button>
                      );
                   })}
                </div>
             </GlassCard>

             <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">Available Slots</h3>
                <div className="grid grid-cols-2 gap-4">
                   {timeSlots.map(slot => (
                     <button 
                        key={slot} 
                        onClick={() => setSelectedTime(slot)}
                        className={cn(
                          "glass-button py-4 border-white/5 text-[10px] font-bold uppercase tracking-[0.1em] transition-all rounded-2xl",
                          selectedTime === slot ? "bg-emerald-500 text-white border-emerald-500/50" : "bg-white/5 text-white/60 hover:border-emerald-500/40 hover:text-white"
                        )}
                      >
                        {slot}
                     </button>
                   ))}
                </div>
                <button 
                  onClick={handleBook}
                  disabled={isBooking || !selectedSpecialist || !selectedTime}
                  className="w-full purple-gradient py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm mt-8 shadow-2xl shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all text-white disabled:opacity-50 disabled:hover:scale-100"
                >
                   {isBooking ? "Booking..." : "Book Appointment"}
                </button>
             </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-6">
           <GlassCard delay={0.4} className="bg-emerald-600/5 group border-emerald-500/10 p-8 shadow-emerald-500/5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/10 ring-1 ring-white/10">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Verified Care</h3>
              <p className="text-xs text-white/40 mb-8 font-medium leading-relaxed">Our specialists pass rigorous background checks and professional licensing verification to ensure the highest standard of support.</p>
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-[#040D0E] bg-white/10 flex items-center justify-center overflow-hidden border border-white/10">
                    <User className="text-white/20 w-5 h-5" />
                  </div>
                ))}
                <div className="inline-block h-10 w-10 rounded-full ring-4 ring-[#040D0E] bg-emerald-500 flex items-center justify-center text-[11px] font-bold text-white shadow-xl shadow-emerald-500/20 transition-transform hover:scale-110 cursor-pointer">+28</div>
              </div>
           </GlassCard>

           <GlassCard delay={0.5} className="space-y-6 p-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 tracking-widest">Your Safety First</h3>
              <div className="space-y-6">
                 {[
                   { icon: Video, text: "Encrypted HD Video Sessions" },
                   { icon: ShieldCheck, text: "Full Anonymity Options" },
                   { icon: Clock, text: "Fast Instant Scheduling" }
                 ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-default">
                       <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                          <item.icon className="w-4 h-4 text-emerald-500" />
                       </div>
                       <span className="text-xs font-semibold text-white/60 group-hover:text-white transition-colors">{item.text}</span>
                    </div>
                 ))}
              </div>
           </GlassCard>
        </aside>
      </div>

      {/* Cancellation Confirmation Dialog */}
      <AnimatePresence>
        {viewingSpecialist && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingSpecialist(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-2xl glass-card overflow-hidden grid grid-cols-1 md:grid-cols-2 p-0 border-white/10"
            >
              <div className="h-full">
                <img 
                  src={viewingSpecialist.image} 
                  alt={viewingSpecialist.name} 
                  className="w-full h-full object-cover grayscale-[20%] sepia-[10%]"
                />
              </div>
              <div className="p-8 space-y-6 bg-[#040D0E]/80 backdrop-blur-md">
                <div className="space-y-1">
                   <div className="flex items-center gap-2 mb-2">
                     <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/20">Verified Professional</span>
                   </div>
                   <h3 className="text-2xl font-bold tracking-tight text-white">{viewingSpecialist.name}</h3>
                   <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">{viewingSpecialist.specialty}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Biography</p>
                    <p className="text-xs text-white/60 leading-relaxed font-medium">{viewingSpecialist.bio}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Experience</p>
                      <p className="text-xs font-bold text-white">{viewingSpecialist.experience}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Education</p>
                      <p className="text-xs font-bold text-white line-clamp-2">{viewingSpecialist.education}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {viewingSpecialist.languages?.map(lang => (
                        <span key={lang} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-white/80 border border-white/5">{lang}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                   <button 
                    onClick={() => {
                      setSelectedSpecialist(viewingSpecialist);
                      setViewingSpecialist(null);
                    }}
                    className="w-full purple-gradient py-4 rounded-xl font-bold uppercase tracking-widest text-xs text-white shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                   >
                     Select Counselor
                   </button>
                   <button 
                    onClick={() => setViewingSpecialist(null)}
                    className="w-full py-3 mt-2 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                   >
                     Close Details
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {cancellingAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancellingAppointment(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm glass-card p-8 border-red-500/20 bg-red-950/20 shadow-2xl shadow-red-500/10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <AlertTriangle className="w-32 h-32 text-red-500" />
              </div>

              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-400 ring-1 ring-red-500/30">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">Cancel Session?</h3>
                  <p className="text-xs text-white/40 font-medium">Are you sure you want to cancel your session with {cancellingAppointment.specialistName}?</p>
                </div>

                <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Date</span>
                    <span className="text-xs font-bold text-white">{cancellingAppointment.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Time</span>
                    <span className="text-xs font-bold text-white">{cancellingAppointment.time}</span>
                  </div>
                </div>

                <div className="flex flex-col w-full gap-3">
                  <button
                    onClick={confirmCancel}
                    disabled={isCancelling}
                    className="w-full bg-red-600 hover:bg-red-500 py-4 rounded-xl font-bold uppercase tracking-widest text-xs text-white shadow-xl shadow-red-600/20 transition-all disabled:opacity-50"
                  >
                    {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
                  </button>
                  <button
                    onClick={() => setCancellingAppointment(null)}
                    disabled={isCancelling}
                    className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] text-white/40 hover:text-white transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
