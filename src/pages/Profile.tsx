import { useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { GlassCard } from "../components/UI/GlassCard";
import { User, Camera, Check, Loader2, LogOut } from "lucide-react";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "motion/react";

export default function Profile() {
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isUpdating) return;

    setIsUpdating(true);
    setSuccess(false);

    try {
      // 1. Update Auth Profile
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL
      });

      // 2. Sync to Firestore
      await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        displayName: displayName,
        photoURL: photoURL,
        email: user.email,
        lastActive: serverTimestamp()
      }, { merge: true });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-white/40 text-sm">Manage your public identity and account settings.</p>
      </header>

      <GlassCard className="p-8">
        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-emerald-500/20 group-hover:ring-emerald-500/40 transition-all shadow-2xl shadow-emerald-500/10">
                <img 
                  src={photoURL || `https://ui-avatars.com/api/?name=${displayName || 'User'}&background=10B981&color=fff`} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 purple-gradient rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-all border border-white/10">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-white tracking-tight">{displayName || "Anonymous User"}</h2>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Display Name</label>
              <input 
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500/30 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Avatar URL</label>
              <input 
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://images.unsplash.com/your-photo"
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500/30 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={isUpdating}
              className="w-full h-14 purple-gradient rounded-2xl font-bold uppercase tracking-widest text-white shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isUpdating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : success ? (
                <div className="flex items-center gap-2">
                   <Check className="w-5 h-5" />
                   <span>Saved!</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <GlassCard className="p-6 border-white/5 bg-white/5 flex items-center gap-4 group">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Account Status</p>
            <p className="text-sm font-bold text-white uppercase tracking-tight">Verified Patient</p>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6 border-white/5 bg-white/5 flex items-center gap-4 group">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Data Privacy</p>
            <p className="text-sm font-bold text-white uppercase tracking-tight">Encrypted & Secure</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-white/5 bg-white/5 flex items-center gap-4 group cursor-pointer hover:bg-red-500/10 hover:border-red-500/20 transition-all">
          <div 
            onClick={async () => {
              if (window.confirm("Are you sure you want to log out?")) {
                await logout();
                window.location.href = "/";
              }
            }}
            className="flex items-center gap-4 w-full"
          >
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Account Session</p>
              <p className="text-sm font-bold text-white uppercase tracking-tight">Sign Out</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
