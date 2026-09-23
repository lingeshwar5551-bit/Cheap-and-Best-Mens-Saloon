import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export interface UserProfileData {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Sync user profile to Firestore `users/{uid}`
 */
export async function syncUserProfile(user: User, additionalData?: Partial<UserProfileData>) {
  if (!user || !user.uid) return;
  const userRef = doc(db, 'users', user.uid);
  try {
    const existingSnap = await getDoc(userRef);
    const now = new Date().toISOString();
    
    if (!existingSnap.exists()) {
      const newProfile: UserProfileData = {
        userId: user.uid,
        name: user.displayName || additionalData?.name || 'Valued Guest',
        email: user.email || '',
        phone: additionalData?.phone || user.phoneNumber || '',
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(userRef, newProfile);
    } else if (additionalData) {
      await setDoc(userRef, { ...additionalData, updatedAt: now }, { merge: true });
    }
  } catch (err) {
    console.error('Failed to sync user profile:', err);
  }
}

/**
 * Sign in using Google OAuth popup
 */
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  if (result.user) {
    await syncUserProfile(result.user);
  }
  return result.user;
}

/**
 * Sign in with email and password
 */
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  await syncUserProfile(cred.user);
  return cred.user;
}

/**
 * Create a new account with email and password
 */
export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName: string,
  phone?: string
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  await syncUserProfile(cred.user, { name: displayName, phone: phone || '' });
  return cred.user;
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Sign out the currently active user
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribe to authentication state changes
 */
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
