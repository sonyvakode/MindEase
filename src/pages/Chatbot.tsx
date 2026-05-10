import { useState, useRef, useEffect } from "react";
import { GlassCard } from "../components/UI/GlassCard";
import { Send, Bot, User, Sparkles, Plus, Smile, MessageSquare, ArrowLeft } from "lucide-react";
import { getChatResponse } from "../services/gemini";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";
import { Specialist } from "../types";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

export default function Chatbot({ specialist }: { specialist?: Specialist }) {
  const initialMessage = specialist 
    ? `Hello! I'm ${specialist.name}, your ${specialist.specialty}. I'm here for our scheduled session. How have you been since we last spoke?`
    : "Hello! 👋 I'm MindEase AI. I'm here to listen and support you. How are you feeling today?";

  const [messages, setMessages] = useState<Message[]>([
    { role: "model", parts: [{ text: initialMessage }] }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const counselorSpeeches = [
    "Hello! I wanted to remind you that your well-being is a priority. Remember to take deep breaths, stay hydrated, and be kind to yourself today. You are doing great!",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. Keep pushing forward, one step at a time. Your mental health matters.",
    "Health is a state of complete physical, mental and social well-being. Make sure to find time for things that bring you joy today. A little self-care goes a long way.",
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle. You have the strength to overcome anything."
  ];

  const triggerCounselorSpeech = () => {
    const speech = counselorSpeeches[Math.floor(Math.random() * counselorSpeeches.length)];
    setMessages(prev => [...prev, { role: "model", parts: [{ text: `**Counselor Advice:** \n\n${speech}` }] }]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, parts: m.parts }));
      
      // Specialist Context injection
      let contextPrompt = input;
      if (specialist && messages.length < 3) {
         contextPrompt = `[CONTEXT: Act as ${specialist.name}, a ${specialist.specialty} with the following background: ${specialist.bio}. You are in a counseling session with a patient. Use a warm, professional, and therapeutic tone suitable for ${specialist.specialty}.] ${input}`;
      }

      const response = await getChatResponse(contextPrompt, history);
      setMessages((prev) => [...prev, { role: "model", parts: [{ text: response }] }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-2rem)] lg:h-[calc(100vh-4rem)]">
      <header className="flex items-center justify-between shrink-0 px-2">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            {specialist ? "Counseling Session" : "AI Chatbot"}
          </h1>
          {specialist && (
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/20">Live Session</span>
          )}
        </div>
        <p className="text-white/40 text-sm hidden md:block">
          {specialist ? `Session with ${specialist.name}` : "Empathetic, real-time AI support companion."}
        </p>
      </header>

      <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden border-white/5" delay={0.1}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden border border-white/10",
              specialist ? "" : "purple-gradient shadow-emerald-500/20"
            )}>
              {specialist ? (
                <img src={specialist.image} className="w-full h-full object-cover" alt={specialist.name} />
              ) : (
                <Bot className="text-white w-6 h-6" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold uppercase tracking-tight">{specialist ? specialist.name : "MindEase AI"}</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10B981]" />
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button 
               onClick={triggerCounselorSpeech}
               className="glass-button px-4 h-10 flex items-center justify-center gap-2 rounded-full hover:bg-white/10 transition-colors text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/30"
               title="Special Advice"
             >
               <Sparkles className="w-4 h-4" />
               <span className="hidden sm:inline">Daily Boost</span>
             </button>
             <button 
               onClick={() => {
                 if (confirm("Clear chat history?")) {
                   setMessages([{ role: "model", parts: [{ text: "Hello! 👋 Chat history cleared. How can I help you now?" }] }]);
                 }
               }}
               className="glass-button w-10 h-10 flex items-center justify-center p-0 rounded-full hover:bg-white/10 transition-colors"
               title="Clear Chat"
             >
               <Plus className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth relative"
        >
          <div className="hidden lg:block absolute bottom-8 left-8 w-40 h-40 pointer-events-none opacity-20">
             <img 
               src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" 
               className="w-full h-full object-contain"
               alt="Robot Decor"
             />
          </div>
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  m.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-lg overflow-hidden border border-white/10",
                  m.role === "model" ? (specialist ? "" : "purple-gradient shadow-emerald-500/20") : "bg-white/10"
                )}>
                  {m.role === "model" ? (
                    specialist ? <img src={specialist.image} className="w-full h-full object-cover" /> : <Bot className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className={cn(
                  "p-4 px-5 rounded-3xl text-sm leading-relaxed font-normal shadow-2xl transition-all",
                  m.role === "model" 
                    ? "bg-white/5 border border-white/10 text-white/90 rounded-tl-none shadow-black/20" 
                    : "purple-gradient text-white rounded-tr-none shadow-emerald-500/10 group"
                )}>
                  <div className="markdown-body">
                    <ReactMarkdown>
                      {m.parts[0].text}
                    </ReactMarkdown>
                  </div>
                  <div className={cn(
                     "text-[8px] mt-2 font-bold opacity-30 uppercase tracking-widest",
                     m.role === "user" ? "text-right" : "text-left"
                  )}>
                     {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center animate-pulse border border-white/10">
                {specialist ? <img src={specialist.image} className="w-full h-full object-cover" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5 ring-1 ring-white/5">
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 bg-white/5 border-t border-white/5">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-6 pr-24 outline-none focus:border-emerald-500/50 transition-all text-sm font-medium placeholder:text-white/20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={cn(
                   "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                   input.trim() ? "purple-gradient text-white shadow-lg shadow-emerald-500/30 hover:scale-110 active:scale-95" : "bg-white/5 text-white/20"
                )}
              >
                <Send className="w-5 h-5 -rotate-45 -translate-y-0.5 translate-x-0.5" />
              </button>
            </div>
          </form>
          <p className="text-[10px] text-white/20 text-center mt-4 uppercase tracking-[0.2em] font-bold">
            {specialist ? `Session with ${specialist.name} • AI Managed Conversation` : "MindEase AI • Not a replacement for clinical care"}
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
