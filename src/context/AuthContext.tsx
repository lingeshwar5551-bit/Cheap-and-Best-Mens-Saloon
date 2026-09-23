import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  subscribeToAuth,
  signInWithGoogle,
  loginWithEmail,
  signUpWithEmail,
  sendPasswordReset,
  logoutUser,
  UserProfileData
} from '../services/auth';
import { getUserProfile, updateUserProfile } from '../services/firestore';

interface AuthContextType {
  user: User | null;
  profile: UserProfileData | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  isDashboardOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openDashboard: () => void;
  closeDashboard: () => void;
  signInWithGoogle: () => Promise<User>;
  loginWithEmail: (email: string, pass: string) => Promise<User>;
  signUpWithEmail: (email: string, pass: string, name: string, phone?: string) => Promise<User>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfileData: (data: { name?: string; phone?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const fetchProfile = async (uid: string) => {
    try {
      const data = await getUserProfile(uid);
      if (data) {
        setProfile(data as UserProfileData);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.uid);
    }
  };

  const updateProfileData = async (data: { name?: string; phone?: string }) => {
    if (user) {
      await updateUserProfile(user.uid, data);
      await fetchProfile(user.uid);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
    setIsDashboardOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthModalOpen,
        isDashboardOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        openDashboard: () => setIsDashboardOpen(true),
        closeDashboard: () => setIsDashboardOpen(false),
        signInWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        logout,
        refreshProfile,
        updateProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
