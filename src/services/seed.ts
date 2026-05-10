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
];

const resources = [
  { id: "1", title: "Morning Meditation", category: "Meditation", duration: "10 min", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80" },
  { id: "2", title: "Deep Breathing 101", category: "Breathing", duration: "5 min", image: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=800&q=80" },
  { id: "3", title: "Sleep Hygiene Tips", category: "Sleep", duration: "15 min", image: "https://images.unsplash.com/photo-1511295742364-917e70351634?w=800&q=80" },
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
