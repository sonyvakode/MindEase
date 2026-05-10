import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";

const specialists = [
  { 
    id: "4", 
    name: "Dr. David Miller", 
    specialty: "Psychiatrist", 
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    rating: 4.9,
    verified: true,
    bio: "Board-certified psychiatrist with a focus on medication management and integrative psychiatry.",
    experience: "15 Years",
    education: "M.D. in Psychiatry, Johns Hopkins University",
    languages: ["English", "Spanish"] 
  },
  { 
    id: "5", 
    name: "Sarah Jenkins", 
    specialty: "Youth Support Specialist", 
    image: "https://images.unsplash.com/photo-1559839734-2b71ef197ec2?w=400&q=80",
    rating: 4.8,
    verified: true,
    bio: "Dedicated to the unique challenges faced by adolescents and young adults.",
    experience: "6 Years",
    education: "Master of Social Work, Columbia University",
    languages: ["English"] 
  },
  { 
    id: "1", 
    name: "Dr. Ananya Sharma", 
    specialty: "Clinical Psychologist", 
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    rating: 4.9,
    verified: true,
    bio: "Expert in cognitive behavioral therapy (CBT) and mindfulness-based stress reduction. Dr. Sharma has dedicated over a decade to helping young adults navigate life transitions.",
    experience: "12 Years",
    education: "Ph.D. in Clinical Psychology, Stanford University",
    languages: ["English", "Hindi", "Punjabi"]
  },
  { 
    id: "2", 
    name: "Dr. Rohan Mehta", 
    specialty: "Mental Wellness Counsellor", 
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80",
    rating: 4.8,
    verified: true,
    bio: "Specializing in student mental health and career counseling.",
    experience: "8 Years",
    education: "M.A. in Applied Psychology, Delhi University",
    languages: ["English", "Hindi", "Gujarati"]
  },
  { 
    id: "3", 
    name: "Dr. Priya Patel", 
    specialty: "Behavioral Therapist", 
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
    rating: 4.7,
    verified: true,
    bio: "Dr. Patel focuses on emotional regulation and neurodiversity support.",
    experience: "6 Years",
    education: "M.Sc. in Psychological Research, University of Edinburgh",
    languages: ["English", "Hindi", "Marathi"]
  },
];

const resources = [
  {
    id: "1",
    title: "5-Minute Mindfulness Meditation",
    category: "Meditation",
    duration: "5 min",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=inpok4MKVLM"
  },
  {
    id: "2",
    title: "Box Breathing Technique",
    category: "Breathing",
    duration: "5 min",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=acUZdGd_3Dg"
  },
  {
    id: "3",
    title: "Deep Sleep & Relaxation Guide",
    category: "Sleep",
    duration: "15 min",
    image: "https://images.unsplash.com/photo-1541480601022-2305c9f02487?auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=nm1TxQj9IsQ"
  },
  {
    id: "4",
    title: "Managing Stress & Anxiety",
    category: "Stress Relief",
    duration: "10 min",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=WWloIAQpID0"
  },
  {
    id: "5",
    title: "Focus & Flow State Meditation",
    category: "Meditation",
    duration: "12 min",
    image: "https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=86m4RL49uK4"
  },
  {
    id: "6",
    title: "4-7-8 Breathing for Better Sleep",
    category: "Breathing",
    duration: "8 min",
    image: "https://images.unsplash.com/photo-1502129075440-6b60ad688b2a?auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=PmBYdfv5RSk"
  }
];

export async function seedDatabase() {
  if (!auth.currentUser) return;
  
  try {
    // Seed all specialists (setDoc will update if exists, ensuring all 8 are present)
    for (const s of specialists) {
      await setDoc(doc(db, "specialists", s.id), s);
    }
    console.log("Specialists synced");

    const resSnap = await getDocs(collection(db, "resources"));
    if (resSnap.empty) {
      for (const r of resources) {
        await setDoc(doc(db, "resources", r.id), r);
      }
      console.log("Resources seeded");
    }
  } catch (error) {
    console.warn("Seeding skipped or failed (likely permissions for non-admin):", error);
  }
}
