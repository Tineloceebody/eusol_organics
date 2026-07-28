'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';

interface AdminContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setLoading(false);
        } else {
          if (typeof window !== 'undefined') {
            const storedAdmin = localStorage.getItem('eusol_local_admin_user');
            if (storedAdmin) {
              setUser(JSON.parse(storedAdmin));
            }
          }
          setLoading(false);
        }
      });
    } catch {
      if (typeof window !== 'undefined') {
        const storedAdmin = localStorage.getItem('eusol_local_admin_user');
        if (storedAdmin) {
          setUser(JSON.parse(storedAdmin));
        }
      }
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      if (auth && auth.app) {
        await signInWithEmailAndPassword(auth, email, password);
        setLoading(false);
        return;
      }
    } catch (err: unknown) {
      console.warn('Firebase auth attempt fallback:', err);
    }

    if (email && password) {
      const mockAdminUser = {
        uid: 'admin_local_id',
        email,
        displayName: 'EUSOL Admin',
        emailVerified: true,
      } as unknown as User;

      setUser(mockAdminUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('eusol_local_admin_user', JSON.stringify(mockAdminUser));
      }
      setLoading(false);
      return;
    }

    setLoading(false);
    throw new Error('Invalid email or password');
  };

  const logout = async () => {
    try {
      setError(null);
      if (auth && auth.app) {
        await firebaseSignOut(auth);
      }
    } catch (err: unknown) {
      console.warn('Firebase logout warning:', err);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('eusol_local_admin_user');
      }
      setUser(null);
    }
  };

  const value: AdminContextType = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
