export interface Mood {
  id: string;
  date: string;
  mood: string;
  score: number;
}

export interface Appointment {
  id: string;
  userId: string;
  specialistId: string;
  specialistName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: any;
}

export interface Resource {
  id: string;
  title: string;
  category: string;
  duration: string;
  image: string;
  url?: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  author: string;
  text: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  text: string;
  timestamp: any;
}

export interface WellnessAnalytics {
  moodAverage: number;
  totalSessions: number;
  weeklyProgress: { day: string; score: number }[];
}

export interface Specialist {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating?: number;
  verified?: boolean;
  bio?: string;
  experience?: string;
  education?: string;
  languages?: string[];
}
