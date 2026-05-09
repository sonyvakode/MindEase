import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      { id: 1, author: "Anonymous", text: "Today was a tough day, but I'm proud of myself for getting through it.", likes: 12, comments: 2, timestamp: "2h ago" },
      { id: 2, author: "Anonymous", text: "Does anyone have tips for morning anxiety?", likes: 8, comments: 5, timestamp: "4h ago" },
    ],
    specialists: [
      { id: "1", name: "Dr. Ananya Sharma", specialty: "Psychologist", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
      { id: "2", name: "Dr. Rohan Mehta", specialty: "Counsellor", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80" },
      { id: "3", name: "Dr. Priya Patel", specialty: "Therapist", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80" },
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
    const newPost = { id: db.communityPosts.length + 1, author: "Anonymous", likes: 0, comments: 0, timestamp: "Just now", ...req.body };
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
