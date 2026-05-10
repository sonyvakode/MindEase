import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  auth, 
  signInWithGoogle, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<User>;
  loginWithEmail: (email: string, pass: string) => Promise<User>;
  registerWithEmail: (email: string, pass: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    return await signInWithGoogle();
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    return res.user;
  };

  const registerWithEmail = async (email: string, pass: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    return res.user;
  };

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithEmail, registerWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
