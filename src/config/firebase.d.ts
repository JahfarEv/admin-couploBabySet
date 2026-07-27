// declare module '@/config/firebase' {
//   export const auth: any;
//   export const db: any;
//   export const browserLocalPersistence: any;
//   export const browserSessionPersistence: any;
//   export const onAuthStateChanged: (authInstance: any, callback: (user: any) => void) => () => void;
//   export const setPersistence: (authInstance: any, persistence: any) => Promise<void>;
//   export const sendPasswordResetEmail: (authInstance: any, email: string) => Promise<any>;
//   export const signInWithEmailAndPassword: (authInstance: any, email: string, password: string) => Promise<any>;
//   export const signOut: (authInstance: any) => Promise<void>;
//   export const collection: (...args: any[]) => any;
//   export const addDoc: (ref: any, data: any) => Promise<any>;
//   export const doc: (...args: any[]) => any;
//   export const setDoc: (ref: any, data: any, options?: any) => Promise<void>;
//   export const updateDoc: (ref: any, data: any) => Promise<void>;
//   export const deleteDoc: (ref: any) => Promise<void>;
//   export const query: (...args: any[]) => any;
//   export const orderBy: (...args: any[]) => any;
//   export const getDoc: (ref: any) => Promise<any>;
//   export const serverTimestamp: () => any;
//   export const onSnapshot: (queryRef: any, callback: (snapshot: any) => void, onError?: (error: any) => void) => () => void;
// }








// src/config/firebase.d.ts
export const app: any;
export const auth: any;
export const db: any;
export const storage: any;

// Auth exports
export const signInWithEmailAndPassword: (auth: any, email: string, password: string) => Promise<any>;
export const signOut: (auth: any) => Promise<void>;
export const onAuthStateChanged: (auth: any, callback: (user: any) => void) => () => void;
export const setPersistence: (auth: any, persistence: any) => Promise<void>;
export const browserLocalPersistence: any;
export const browserSessionPersistence: any;
export const sendPasswordResetEmail: (auth: any, email: string) => Promise<void>;

// Firestore exports - ADD ALL OF THESE
export const collection: (db: any, path: string) => any;
export const addDoc: (collection: any, data: any) => Promise<any>;
export const getDocs: (query: any) => Promise<any>;  // ✅ Add this
export const getDoc: (ref: any) => Promise<any>;
export const doc: (db: any, path: string, ...segments: string[]) => any;
export const setDoc: (ref: any, data: any, options?: any) => Promise<void>;
export const updateDoc: (ref: any, data: any) => Promise<void>;
export const deleteDoc: (ref: any) => Promise<void>;
export const query: (collection: any, ...queryConstraints: any[]) => any;  // ✅ Add this
export const where: (field: string, op: string, value: any) => any;  // ✅ Add this
export const orderBy: (field: string, direction?: string) => any;  // ✅ Add this
export const limit: (limit: number) => any;  // ✅ Add this
export const onSnapshot: (query: any, callback: (snapshot: any) => void, onError?: (error: any) => void) => () => void;
export const serverTimestamp: () => any;
export const Timestamp: any;
export const writeBatch: (db: any) => any;

// Storage exports
export const ref: (storage: any, path: string) => any;
export const uploadBytes: (ref: any, data: any) => Promise<any>;
export const getDownloadURL: (ref: any) => Promise<string>;
export const deleteObject: (ref: any) => Promise<void>;
