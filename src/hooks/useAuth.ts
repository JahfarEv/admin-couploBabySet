// import { useContext } from 'react'
// import { AuthContext } from '@/context/AuthContext'

// export function useAuth() {
//   const ctx = useContext(AuthContext)
//   if (!ctx) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return ctx
// }



import { useEffect, useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import {
  auth,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from '@/config/firebase';

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { AdminUser } from '@/types';

function mapFirebaseUser(user: FirebaseUser | null): AdminUser | null {
  if (!user) return null;

  return {
    name: user.displayName ?? user.email?.split('@')[0] ?? 'Admin User',
    email: user.email ?? 'admin@couplo.com',
    role: 'Management Suite',
  };
}

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(mapFirebaseUser(currentUser));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, remember = false) => {
    try {
      setError(null);
      setIsLoading(true);

      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence,
      );

      // const userCredential = await signInWithEmailAndPassword(auth, email, password);


      const userCredential = await signInWithEmailAndPassword(
  auth,
  email,
  password
);

const uid = userCredential.user.uid;
// console.log(uid, 'uid');

const adminRef = doc(db, "admin", uid)
console.log(adminRef, 'admin');

const adminSnap = await getDoc(adminRef);

console.log("Exists:", adminSnap.exists());

if (adminSnap.exists()) {
  console.log("Data:", adminSnap.data());
} else {
  console.log("Document not found");
}

if (!adminSnap.exists()) {
  await signOut(auth);
  throw new Error("You are not authorized to access the admin panel.");
}

const admin = adminSnap.data();

if (!admin.active) {
  await signOut(auth);
  throw new Error("Admin account is disabled.");
}

setUser(mapFirebaseUser(userCredential.user))
      // setUser(mapFirebaseUser(userCredential.user));
      return userCredential.user;
   } catch (err) {
  let errorMessage: string;

  if (err instanceof Error && !('code' in err)) {
    // Our own custom errors
    errorMessage = err.message;
  } else {
    // Firebase auth errors
    errorMessage = getAuthErrorMessage(err);
  }

  setError(errorMessage);
  throw new Error(errorMessage);
} finally {
  setIsLoading(false);
}
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getAuthErrorMessage = (err: unknown) => {
    const code = typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code?: string }).code)
      : undefined;

    const messages: Record<string, string> = {
      'auth/invalid-email': 'Invalid email address format',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/email-already-in-use': 'This email is already registered',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled',
    };

    return messages[code ?? ''] || 'An error occurred during login. Please try again.';
  };

  return { user, isAuthenticated: Boolean(user), isLoading, error, login, logout, resetPassword };
}