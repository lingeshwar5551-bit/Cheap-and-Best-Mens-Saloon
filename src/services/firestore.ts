import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(errInfo.error);
}

// Data Interfaces
export interface BookingRecord {
  bookingId: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  service: string;
  stylist?: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface GameScoreRecord {
  scoreId: string;
  userId: string;
  score: number;
  haircutQuality: string;
  selectedTools: string[];
  completionPercentage: number;
  timestamp: string;
}

export interface FeedbackRecord {
  feedbackId: string;
  userId: string;
  rating: number;
  comment: string;
  category?: string;
  timestamp: string;
}

export interface FavoriteRecord {
  favoriteId: string;
  userId: string;
  serviceId: string;
  serviceTitle: string;
  timestamp: string;
}

// ----------------- USER PROFILE -----------------
export async function getUserProfile(userId: string) {
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function updateUserProfile(userId: string, data: { name?: string; phone?: string }) {
  const path = `users/${userId}`;
  try {
    await setDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ----------------- BOOKINGS -----------------
export async function createBooking(data: Omit<BookingRecord, 'bookingId' | 'createdAt'>): Promise<string> {
  const bookingId = `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `bookings/${bookingId}`;
  const record: BookingRecord = {
    ...data,
    bookingId,
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'bookings', bookingId), record);
    return bookingId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getUserBookings(userId: string): Promise<BookingRecord[]> {
  const path = 'bookings';
  try {
    const q = query(collection(db, 'bookings'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const bookings: BookingRecord[] = [];
    snap.forEach((d) => {
      bookings.push(d.data() as BookingRecord);
    });
    return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function cancelBooking(bookingId: string): Promise<void> {
  const path = `bookings/${bookingId}`;
  try {
    await setDoc(doc(db, 'bookings', bookingId), { status: 'cancelled' }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ----------------- BARBER GAME SCORES -----------------
export async function saveGameScore(data: Omit<GameScoreRecord, 'scoreId'>): Promise<string> {
  const scoreId = `gs_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `gameScores/${scoreId}`;
  const record: GameScoreRecord = {
    ...data,
    scoreId
  };
  try {
    await setDoc(doc(db, 'gameScores', scoreId), record);
    return scoreId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getUserGameScores(userId: string): Promise<GameScoreRecord[]> {
  const path = 'gameScores';
  try {
    const q = query(collection(db, 'gameScores'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const scores: GameScoreRecord[] = [];
    snap.forEach((d) => {
      scores.push(d.data() as GameScoreRecord);
    });
    return scores.sort((a, b) => b.score - a.score);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// ----------------- FEEDBACK -----------------
export async function submitFeedback(data: Omit<FeedbackRecord, 'feedbackId'>): Promise<string> {
  const feedbackId = `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `feedback/${feedbackId}`;
  const record: FeedbackRecord = {
    ...data,
    feedbackId
  };
  try {
    await setDoc(doc(db, 'feedback', feedbackId), record);
    return feedbackId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// ----------------- FAVORITES -----------------
export async function toggleFavorite(userId: string, serviceId: string, serviceTitle: string): Promise<boolean> {
  const favoriteId = `${userId}_${serviceId}`;
  const path = `favorites/${favoriteId}`;
  try {
    const ref = doc(db, 'favorites', favoriteId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await deleteDoc(ref);
      return false; // removed
    } else {
      const record: FavoriteRecord = {
        favoriteId,
        userId,
        serviceId,
        serviceTitle,
        timestamp: new Date().toISOString()
      };
      await setDoc(ref, record);
      return true; // added
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserFavorites(userId: string): Promise<FavoriteRecord[]> {
  const path = 'favorites';
  try {
    const q = query(collection(db, 'favorites'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const favorites: FavoriteRecord[] = [];
    snap.forEach((d) => {
      favorites.push(d.data() as FavoriteRecord);
    });
    return favorites;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function subscribeToUserFavorites(userId: string, callback: (favorites: FavoriteRecord[]) => void) {
  const q = query(collection(db, 'favorites'), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const favs: FavoriteRecord[] = [];
    snapshot.forEach((d) => favs.push(d.data() as FavoriteRecord));
    callback(favs);
  }, (err) => {
    console.error('Favorites snapshot error:', err);
  });
}
