import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();


let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Mock Database (since Postgres requires setup)
  const db = {
    appointments: [
      { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Clinical Psychologist", date: "2026-05-15", time: "10:00 AM", status: "Available" },
      { id: 2, doctor: "Dr. Michael Chen", specialty: "Psychiatrist", date: "2026-05-16", time: "02:30 PM", status: "Available" },
      { id: 3, doctor: "Emily Roberts", specialty: "Therapist", date: "2026-05-17", time: "11:00 AM", status: "Available" },
    ],
    moods: [
      { id: 1, date: "2026-05-03", mood: "Happy", score: 8 },
      { id: 2, date: "2026-05-04", mood: "Calm", score: 7 },
      { id: 3, date: "2026-05-05", mood: "Anxious", score: 4 },
      { id: 4, date: "2026-05-06", mood: "Tired", score: 5 },
      { id: 5, date: "2026-05-07", mood: "Calm", score: 7 },
      { id: 6, date: "2026-05-08", mood: "Happy", score: 9 },
      { id: 7, date: "2026-05-09", mood: "Happy", score: 8 },
    ],
    resources: [
      { id: 1, title: "Deep Breathing 101", category: "Breathing", duration: "5 min", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=60" },
      { id: 2, title: "Better Sleep Habits", category: "Sleep", duration: "10 min", image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=60" },
      { id: 3, title: "Managing Work Stress", category: "Stress", duration: "15 min", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60" },
    ],
    communityPosts: [
      { id: 1, authorId: "system-1", author: "Peer Support", text: "Today was a tough day, but I'm proud of myself for getting through it.", likes: 12, comments: 2, timestamp: "2h ago" },
      { id: 2, authorId: "system-2", author: "MindfulBot", text: "Does anyone have tips for morning anxiety?", likes: 8, comments: 5, timestamp: "4h ago" },
    ],
    specialists: [
      { 
        id: "1", 
        name: "Dr. Ananya Sharma", 
        specialty: "Psychologist", 
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
        bio: "Specializing in cognitive behavioral therapy and anxiety disorders with over 12 years of experience.",
        experience: "12 Years",
        education: "PhD in Clinical Psychology, Stanford",
        languages: ["English", "Hindi"]
      },
      { 
        id: "2", 
        name: "Dr. Rohan Mehta", 
        specialty: "Counsellor", 
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80",
        bio: "Expert in relationship counseling and workplace stress management.",
        experience: "8 Years",
        education: "M.Sc. in Counseling Psychology",
        languages: ["English", "Gujarati"]
      },
      { 
        id: "3", 
        name: "Dr. Priya Patel", 
        specialty: "Therapist", 
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
        bio: "Focused on mindfulness-based stress reduction and holistic wellness.",
        experience: "10 Years",
        education: "MA in Psychotherapy",
        languages: ["English", "Punjabi", "Hindi"] 
      },
      { 
        id: "4", 
        name: "Dr. David Miller", 
        specialty: "Psychiatrist", 
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
        bio: "Specialist in medication management and clinical diagnosis of mood disorders.",
        experience: "15 Years",
        education: "MD in Psychiatry, Johns Hopkins",
        languages: ["English", "Spanish"] 
      },
      { 
        id: "5", 
        name: "Sarah Jenkins", 
        specialty: "Youth Specialist", 
        image: "https://images.unsplash.com/photo-1559839734-2b71ef197ec2?w=400&q=80",
        bio: "Dedicated to helping teenagers and young adults navigate identity and academic pressure.",
        experience: "6 Years",
        education: "Master of Social Work",
        languages: ["English"] 
      },
      { 
        id: "6", 
        name: "James Wilson", 
        specialty: "Life Coach", 
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
        bio: "Helping individuals achieve peak performance and personal clarity through goal-oriented coaching.",
        experience: "7 Years",
        education: "Certified Executive Coach",
        languages: ["English"] 
      },
      { 
        id: "7", 
        name: "Dr. Emily Chen", 
        specialty: "Family Therapist", 
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80",
        bio: "Specializing in family dynamics and child psychology with a focus on communication.",
        experience: "9 Years",
        education: "PhD in Family Therapy, UC Berkeley",
        languages: ["English", "Mandarin"] 
      },
      { 
        id: "8", 
        name: "Robert Frost", 
        specialty: "Trauma Specialist", 
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        bio: "EMDR certified therapist focusing on PTSD and complex trauma recovery.",
        experience: "11 Years",
        education: "Master of Clinical Psychology",
        languages: ["English"] 
      },
    ]
  };

  app.get("/api/appointments", (req, res) => {
    res.json(db.appointments);
  });

  app.get("/api/specialists", (req, res) => {
    res.json(db.specialists);
  });

  app.get("/api/moods", (req, res) => {
    res.json(db.moods);
  });

  app.post("/api/moods", (req, res) => {
    const newMood = { id: db.moods.length + 1, date: new Date().toISOString().split('T')[0], ...req.body };
    db.moods.push(newMood);
    res.status(201).json(newMood);
  });

  app.get("/api/resources", (req, res) => {
    res.json(db.resources);
  });

  app.get("/api/community", (req, res) => {
    res.json(db.communityPosts);
  });

  app.post("/api/community", (req, res) => {
    const newPost = { 
      id: db.communityPosts.length + 1, 
      author: req.body.author || "Anonymous", 
      authorId: req.body.authorId || "anon",
      likes: 0, 
      comments: 0, 
      timestamp: "Just now", 
      ...req.body 
    };
    db.communityPosts.unshift(newPost);
    res.status(201).json(newPost);
  });

  app.get("/api/analytics", (req, res) => {
    res.json({
      moodScore: 78,
      activityLevel: "High",
      totalSessions: 24,
      weeklyProgress: [
        { day: "Mon", score: 65 },
        { day: "Tue", score: 70 },
        { day: "Wed", score: 85 },
        { day: "Thu", score: 80 },
        { day: "Fri", score: 90 },
        { day: "Sat", score: 95 },
        { day: "Sun", score: 88 },
      ]
    });
  });

  app.post("/api/chat", async (req, res) => {
    const { prompt, history } = req.body;
    try {
      const client = getGeminiClient();
      if (client) {
        // Map history to the structured format expected by Gemini API
        const contents = Array.isArray(history) 
          ? history.map((h: any) => ({
              role: h.role === "model" ? ("model" as const) : ("user" as const),
              parts: [{ text: h.parts?.[0]?.text || "" }]
            }))
          : [];
        
        // Add latest prompt
        contents.push({
          role: "user" as const,
          parts: [{ text: prompt || "" }]
        });

        const response = await client.models.generateContent({
          model: "gemini-2.5-flash",
          contents: contents,
          config: {
            systemInstruction: "You are MindEase AI, an empathetic, secure, and compassionate counseling assistant. You prioritize context-aware, highly relevant, and deeply personalized responses tailored specifically to the user's current dialogue. Speak directly to the specific details or questions shared by the user; NEVER repeat rigid pre-defined scripts or generic templates. Maintain a warm, encouraging, therapeutic, and active-listening human tone. Provide helpful coping mechanisms, CBT cognitive reframing, or mindfulness advice when appropriate. Always keep responses relatively concise, easy to read, and formatted with clean Markdown. Never provide formal clinical diagnoses.",
          }
        });

        if (response && response.text) {
          return res.json({ text: response.text });
        }
      }
      
      // Fallback if client is not available or failed
      const query = (prompt || "").toLowerCase().trim();
      let answer = `${prompt ? `I hear your thoughts about: "${prompt}".` : "Thank you for reaching out."} Let's check in on how you are holding up emotionally in this exact second? Let me know, and we can explore custom coping tools, CBT frames, or breathing patterns together.`;
      if (query.includes("anxi") || query.includes("stress") || query.includes("panic")) {
        answer = "It sounds like you're dealing with stress or anxiety. Let's practice some gentle grounding. Please take a deep breath through your nose and let it out slowly.";
      } else if (query.includes("sad") || query.includes("lonely") || query.includes("depress")) {
        answer = "I hear you, and it's completely okay to feel sad or lonely. I'm here to listen. Go gently at your own pace.";
      }
      return res.json({ text: answer });
    } catch (error: any) {
      console.error("Chat API error:", error);
      // Fallback
      const query = (prompt || "").toLowerCase().trim();
      let answer = `${prompt ? `I notice you mentioned: "${prompt}".` : "Thank you for sharing."} I am right here holding space for you. How else can we support your emotional flow right now?`;
      if (query.includes("anxi") || query.includes("stress") || query.includes("panic")) {
        answer = "It sounds like you're dealing with stress or anxiety. Let's practice some gentle grounding. Please take a deep breath through your nose and let it out slowly.";
      } else if (query.includes("sad") || query.includes("lonely") || query.includes("depress")) {
        answer = "I hear you, and it's completely okay to feel sad or lonely. I'm here to listen. Go gently at your own pace.";
      }
      return res.json({ text: answer });
    }
  });

  // --- VITE MIDDLEWARE ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
