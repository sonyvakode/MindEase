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

export default function Chatbot({ specialist, bookedAdvisorMode }: { specialist?: Specialist; bookedAdvisorMode?: boolean }) {
  const getSpecialistGreeting = (s: Specialist, isBooked: boolean) => {
    const bookedNotice = isBooked 
      ? `### 🎉 Appointment Confirmed & Checked-In!\n\nThank you so much for booking our session. Since our clinical consultation is successfully scheduled, I wanted to reach out to you **immediately** to offer some specialized clinical guidance you can put into practice right now:`
      : `### Welcome to our session! 🤝\n\nI am glad you joined me here. Let's make this space comfortable and supportive. Here is some immediate professional advice to help you center your thoughts:`;

    let adviceBody = "";

    if (s.id === "1") { // Dr. Ananya Sharma - Clinical Psychologist
      adviceBody = `
#### 🧠 Clinical Focus: Reframing Automatic Thoughts with CBT
As a clinical psychologist specializing in Cognitive Behavioral Therapy, I highly suggest practicing the **CBT ABCD Log** when navigating difficult moments:
*   🔑 **A - Activating Event**: Identify the exact trigger (e.g., *"An exam is coming up"*).
*   💭 **B - Beliefs**: Write down your immediate automatic negative thought (e.g., *"I will fail everything"*).
*   ⚡ **C - Consequences**: Notice how that belief physically makes you feel (e.g., tight chest, stomach drop).
*   🔄 **D - Dispute**: Challenge that story logically! Ask: *"What is the objective, realistic evidence? What is a kinder, more balanced reality?"*

Try shifting your internal critic's statements from *"I can't cope"* to *"This is challenging, but I am learning and navigating it step-by-step."* Tell me about a specific thought you are holding today, and we can restructure it together.`;
    } else if (s.id === "2") { // Dr. Rohan Mehta - Mental Wellness Counsellor
      adviceBody = `
#### 🎯 Core Practice: Reclaiming Your Circle of Control
When we are overwhelmed, our attention is usually consumed by what we cannot control, which completely drains our emotional energy. Let's redirect that:
1.  **Identify Exterior Static**: Public outcomes, other people's expectations, or past mistakes belong *outside* your control.
2.  **Locate Your Center**: Focus strictly on small actionable choices *within* your immediate control (e.g., your breathing, taking a walk, taking a single sip of water, or logging your mood).
3.  **The One-Minute Rule**: Pick just one minor action to do right now to support yourself.

What is a specific goal or event that is weighing on your mind today? Let's break it down into tiny, manageable pieces.`;
    } else if (s.id === "3") { // Dr. Priya Patel - Behavioral Therapist
      adviceBody = `
#### 🌿 Emotional Regulation: Practical Somatic Centering (TIPP)
In behavioral therapy, we understand that when your nervous system is in high alarm, logical thoughts are temporarily unavailable. Let's bring your body back to a calm state first:
*   ❄️ **Temperature Reset**: Splash refreshing cold water on your face. This triggers the natural vagal response, instantly lowering your elevated heart rate.
*   🧘 **Somatic Hand Lock**: Clench your fists as tight as possible for 5 seconds, and then release them completely. Feel the radiant warmth of recovery going through your hands.
*   ⚓ **Sensory Anchor**: Choose one tactile item in your room (like a cooling stone or a soft notebook) and describe its physical texture in your mind.

How is your emotional level feeling in this exact moment? We can work together to ground your physical tension.`;
    } else if (s.id === "4") { // Dr. David Miller - Psychiatrist
      adviceBody = `
#### 🔬 Integrative Medicine: Aligning Your Circadian Baseline
Mental well-being is deeply synchronized with physical physiology. To establish a baseline of mental clarity, I advise starting with three simple habits:
*   ☀️ **Morning Luminescence**: Try to get 10 minutes of natural light outside early in the day to align your cortisol production.
*   💦 **Cortisol Hydration**: Dehydration directly mimics stress panic. Drink a glass of water to signal biological safety to your brain.
*   🔊 **Vagal Humming**: Hum a comforting melody softly for 30 seconds. This simple vibration stimulates your vagus nerve to reduce anxiety.

How have your sleep, hydration, and overall physical energy been matching up lately? Let's take a look at your daily routines.`;
    } else if (s.id === "5") { // Sarah Jenkins - Youth Support Specialist
      adviceBody = `
#### 💫 Compassion Reset: Overcoming Comparison and Demands
Navigating peer environments, career uncertainty, and expectations is incredibly demanding. Let's release the pressure:
*   🚫 **Abolish 'Should'**: Replace *"I should be doing more"* with *"I am navigating a heavy time, doing the best I can, and my worth is not defined by productiveness."*
*   📱 **Digital Detox**: Practice leaving your phone in another room during meals or resting. Give your attention Span room to breathe.
*   🌸 **Grace Dialogue**: Talk to yourself internally using the exact words of support you would choose for a dear friend.

What expectations or deadlines are feeling most overwhelming for you right now? Feel free to share; this is a completely safe, private space to vent.`;
    } else if (s.id === "6") { // Dr. Catherine Bennett - Anxiety & Stress Coach
      adviceBody = `
#### 🌬️ Heart Rate Reset: Deep Diaphragmatic Box Breathing
Anxiety physically accelerates your breath, signaling danger to your nervous system. Let's re-establish physiological safety right now:
1.  📥 **Inhale** slowly through your nose for **4 seconds**.
2.  🧘 **Hold** with comfortable fullness for **4 seconds**.
3.  📤 **Exhale** steadily and completely through your mouth for **4 seconds**.
4.  🍃 **Hold** with relaxed emptiness for **4 seconds**.
Repeat this pattern 3 times.

Where in your physical body (shoulders, throat, hands) is your muscular tension hiding? Tell me what has been triggering your stress today.`;
    } else if (s.id === "7") { // Marcus Vance - Mindfulness & Sleep Consultant
      adviceBody = `
#### 💤 Restorative Habits: Quieting Racing Bedtime Thoughts
Quality sleep is the absolute foundation of cognitive recovery and mood stability. If racing thoughts keep you awake:
*   📓 **Anxiety Offloading**: Keep a physical notebook near your bed. Empty your active concerns onto the page before sleep so your brain feels safe "letting go" of them.
*   🧩 **The Cognitive Shuffling**: Think of a word (like **REST**). For each letter, slowly imagine 5 items beginning with that letter (R: Rain, River, Rose, Ruby...) to occupy your active language processors.
*   🚫 **Clock-Watching Shield**: Turn your devices face-down. Checking the hour only increases emotional adrenaline.

How did you sleep last night, and what does your evening wind-down routine look like? Let's design a customized, peaceful sleep plan.`;
    } else {
      adviceBody = `
#### 🕊️ General Self-Reflection & Guidance
To get the most out of our session, take a slow, restorative breath. Relax your jaw, lower your shoulders, and ask yourself:
*   *What is my primary emotional need right now?*
*   *What current worries are calling for some extra care?*

I am fully here to support you and offer clinical advice. What would you like to focus on for our discussion today?`;
    }

    return `${bookedNotice}\n\n${adviceBody}`;
  };

  const initialMessage = specialist 
    ? getSpecialistGreeting(specialist, !!bookedAdvisorMode)
    : "Hello! 👋 I'm MindEase AI. I'm here to listen and support you. How are you feeling today?";

  const [messages, setMessages] = useState<Message[]>([
    { role: "model", parts: [{ text: initialMessage }] }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const counselorSpeeches: Record<string, string[]> = {
    "1": [
      "The key to cognitive restructuring is patience. When an absolute word like 'never' or 'always' pops up, replace it with 'sometimes' or 'currently' to lower its intensity.",
      "Remember, thoughts are not facts. They are mental events, not objective truths. Give yourself permission to let go of self-criticism."
    ],
    "2": [
      "When overwhelmed, break goals into actionable chunks. Start with just 5 minutes of focused effort.",
      "Resilience isn't about never feeling down; it's about giving yourself the grace to rest and then carry on."
    ],
    "3": [
      "Your nervous system has incredible adaptive powers. Focus on the sensory feedback of your breath or surroundings to enter a state of calmness.",
      "Emotions have a natural 90-second lifespan if we stop fueling them with mental stories. Let the wave pass over you."
    ],
    "4": [
      "Our mental wellness is deeply connected to physical rhythms. Make sure you hydrate, take visual breaks of far horizons, and rest.",
      "Gentle cardiovascular activity or simple stretching is a great way to relieve physical cortisol backlogs."
    ],
    "5": [
      "You don't need to have your entire life figured out today. Taking progress one sunset at a time is perfect.",
      "Set a healthy boundary with digital media. You are not required to consume other people's highlight-reels."
    ],
    "6": [
      "When you feel anxiety rising, elongate your exhales. Making your out-breath longer than your in-breath triggers immediate physical calm.",
      "Panic is intense but temporary. Feet on the ground, back supported, hear the sounds around you. You are safe here."
    ],
    "7": [
      "Prioritize a screen-free wind-down. 30 minutes of simple reading or peaceful music works clean wonders for the sleep cycle.",
      "If you cannot fall asleep, do not force it. Get up, read in a separate room under dim light, and only return to bed when drowsy."
    ],
    "default": [
      "Hello! I wanted to remind you that your well-being is a priority. Remember to take deep breaths, stay hydrated, and be kind to yourself today. You are doing great!",
      "Success is not final, failure is not fatal: it is the courage to continue that counts. Keep pushing forward, one step at a time. Your mental health matters.",
      "Health is a state of complete physical, mental and social well-being. Make sure to find time for things that bring you joy today. A little self-care goes a long way.",
      "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle. You have the strength to overcome anything."
    ]
  };

  const triggerCounselorSpeech = () => {
    const list = specialist && counselorSpeeches[specialist.id] 
      ? counselorSpeeches[specialist.id] 
      : counselorSpeeches["default"];
    const speech = list[Math.floor(Math.random() * list.length)];
    const senderName = specialist ? specialist.name : "MindEase AI Advisor";
    setMessages(prev => [...prev, { role: "model", parts: [{ text: `**Advice from ${senderName}:** \n\n${speech}` }] }]);
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
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-indigo-500/20">Live Session</span>
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
              specialist ? "" : "purple-gradient shadow-indigo-500/20"
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
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_#6366F1]" />
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button 
               onClick={triggerCounselorSpeech}
               className="glass-button px-4 h-10 flex items-center justify-center gap-2 rounded-full hover:bg-white/10 transition-colors text-[10px] font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/30"
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
                  m.role === "model" ? (specialist ? "" : "purple-gradient shadow-indigo-500/20") : "bg-white/10"
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
                    : "purple-gradient text-white rounded-tr-none shadow-indigo-500/10 group"
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
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-6 pr-24 outline-none focus:border-indigo-500/50 transition-all text-sm font-medium placeholder:text-white/20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={cn(
                   "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                   input.trim() ? "purple-gradient text-white shadow-lg shadow-indigo-500/30 hover:scale-110 active:scale-95" : "bg-white/5 text-white/20"
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
