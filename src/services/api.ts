import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { Mood, Appointment, Resource, CommunityPost, WellnessAnalytics, Specialist, CommunityComment } from "../types";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const api = {
  getMoods: async (): Promise<Mood[]> => {
    if (!auth.currentUser) return [];
    const path = "moods";
    try {
      const q = query(
        collection(db, path), 
        where("userId", "==", auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data
        } as any;
      });
      // Sort in memory
      docs.sort((a: any, b: any) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
      
      return docs.map(data => ({
        id: data.id,
        date: data.date,
        mood: data.mood,
        score: data.score
      } as Mood));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  saveMood: async (data: { mood: string; score: number }): Promise<void> => {
    if (!auth.currentUser) throw new Error("Anonymous mood tracking not supported");
    const path = "moods";
    try {
      await addDoc(collection(db, path), {
        userId: auth.currentUser.uid,
        mood: data.mood,
        score: data.score,
        date: new Date().toLocaleDateString(),
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  getAppointments: async (): Promise<Appointment[]> => {
    if (!auth.currentUser) return [];
    const path = "appointments";
    try {
      const q = query(
        collection(db, path),
        where("userId", "==", auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      docs.sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      return docs;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  getSpecialists: async (): Promise<Specialist[]> => {
    const path = "specialists";
    try {
      const snapshot = await getDocs(collection(db, path));
      if (snapshot.empty) {
        return [
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
            bio: "Expert in cognitive behavioral therapy (CBT) and mindfulness-based stress reduction. Dr. Sharma has dedicated over a decade to helping young adults navigate life transitions, academic pressure, and relationship challenges. Her approach is empathetic, evidence-based, and tailored to each individual's unique journey.",
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
            bio: "Specializing in student mental health and career counseling. Dr. Mehta employs a combination of positive psychology and solution-focused brief therapy to help individuals build resilience and find clarity.",
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
            bio: "Dr. Patel focuses on emotional regulation and neurodiversity support. She works closely with individuals to develop coping mechanisms and improve social-emotional skills.",
            experience: "6 Years",
            education: "M.Sc. in Psychological Research, University of Edinburgh",
            languages: ["English", "Hindi", "Marathi"]
          },
        ];
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Specialist));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  getCommunityPosts: async (): Promise<CommunityPost[]> => {
    const path = "community_posts";
    try {
      const q = query(collection(db, path), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        let timeLabel = "some time ago";
        if (data.timestamp instanceof Timestamp) {
          const seconds = Math.floor((Date.now() - data.timestamp.toMillis()) / 1000);
          if (seconds < 60) timeLabel = "just now";
          else if (seconds < 3600) timeLabel = `${Math.floor(seconds / 60)}m ago`;
          else if (seconds < 86400) timeLabel = `${Math.floor(seconds / 3600)}h ago`;
          else timeLabel = `${Math.floor(seconds / 86400)}d ago`;
        }
        return {
          id: doc.id,
          author: data.authorName || "Anonymous",
          authorId: data.authorId,
          text: data.text,
          likes: data.likes || 0,
          comments: data.comments || 0,
          timestamp: timeLabel
        } as CommunityPost;
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  createPost: async (text: string): Promise<void> => {
    if (!auth.currentUser) throw new Error("Must be logged in to post");
    const path = "community_posts";
    try {
      await addDoc(collection(db, path), {
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || "Anonymous",
        text,
        likes: 0,
        comments: 0,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  deletePost: async (postId: string): Promise<void> => {
    if (!auth.currentUser) throw new Error("Must be logged in");
    const path = `community_posts/${postId}`;
    try {
      await deleteDoc(doc(db, "community_posts", postId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  getComments: async (postId: string): Promise<CommunityComment[]> => {
    const path = `community_posts/${postId}/comments`;
    try {
      const q = query(collection(db, path), orderBy("timestamp", "asc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        postId,
        ...doc.data(),
        timestamp: doc.data().timestamp instanceof Timestamp ? doc.data().timestamp.toDate().toLocaleTimeString() : "just now"
      } as CommunityComment));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  addComment: async (postId: string, text: string): Promise<void> => {
    if (!auth.currentUser) throw new Error("Must be logged in to comment");
    const path = `community_posts/${postId}/comments`;
    try {
      await addDoc(collection(db, path), {
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || "Anonymous",
        text,
        timestamp: serverTimestamp()
      });
      // Increment comment count on post
      await updateDoc(doc(db, "community_posts", postId), {
        comments: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  getAnalytics: async (): Promise<WellnessAnalytics> => {
    if (!auth.currentUser) {
      return { moodAverage: 0, totalSessions: 0, weeklyProgress: [] };
    }
    const path = "moods";
    try {
      const q = query(
        collection(db, path),
        where("userId", "==", auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const moods = snapshot.docs.map(d => d.data());
      // Sort in memory
      moods.sort((a: any, b: any) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
      
      const avg = moods.length ? moods.reduce((a, b) => a + (b.score || 0), 0) / moods.length : 0;
      
      const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      
      return {
        moodAverage: parseFloat(avg.toFixed(1)),
        totalSessions: moods.length,
        weeklyProgress: moods.slice(0, 7).reverse().map(m => {
          const d = m.timestamp instanceof Timestamp ? m.timestamp.toDate() : new Date();
          return {
            day: DAYS[d.getDay()],
            score: m.score
          };
        })
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return { moodAverage: 0, totalSessions: 0, weeklyProgress: [] };
    }
  },

  bookAppointment: async (data: { specialistId: string; specialistName: string; date: string; time: string }): Promise<void> => {
    if (!auth.currentUser) throw new Error("Must be logged in to book");
    const path = "appointments";
    try {
      await addDoc(collection(db, path), {
        userId: auth.currentUser.uid,
        specialistId: data.specialistId,
        specialistName: data.specialistName,
        date: data.date,
        time: data.time,
        status: "pending",
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  cancelAppointment: async (appointmentId: string): Promise<void> => {
    if (!auth.currentUser) throw new Error("Must be logged in");
    const path = `appointments/${appointmentId}`;
    try {
      await deleteDoc(doc(db, "appointments", appointmentId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  subscribeToAppointments: (onUpdate: (appointments: Appointment[]) => void) => {
    if (!auth.currentUser) return () => {};
    const path = "appointments";
    const q = query(
      collection(db, path),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      onUpdate(appointments);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  getResources: async (): Promise<Resource[]> => {
    const path = "resources";
    try {
      const snapshot = await getDocs(collection(db, path));
      if (snapshot.empty) {
        return [
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
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },
};
