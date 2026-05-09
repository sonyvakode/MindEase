import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";

const specialists = [
  { id: "1", name: "Dr. Ananya Sharma", specialty: "Psychologist", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80", rating: 4.8, verified: true },
  { id: "2", name: "Dr. Rohan Mehta", specialty: "Counsellor", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80", rating: 4.9, verified: true },
  { id: "3", name: "Dr. Priya Patel", specialty: "Therapist", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80", rating: 4.7, verified: true },
];

const resources = [
  { id: "1", title: "Morning Meditation", category: "Meditation", duration: "10 min", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80" },
  { id: "2", title: "Deep Breathing 101", category: "Breathing", duration: "5 min", image: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=800&q=80" },
  { id: "3", title: "Sleep Hygiene Tips", category: "Sleep", duration: "15 min", image: "https://images.unsplash.com/photo-1511295742364-917e70351634?w=800&q=80" },
];

export async function seedDatabase() {
  if (!auth.currentUser) return;
  
  try {
    const specSnap = await getDocs(collection(db, "specialists"));
    if (specSnap.empty) {
      for (const s of specialists) {
        await setDoc(doc(db, "specialists", s.id), s);
      }
      console.log("Specialists seeded");
    }

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
