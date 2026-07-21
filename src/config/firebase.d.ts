declare module '@/config/firebase' {
  export const auth: any;
  export const db: any;
  export const browserLocalPersistence: any;
  export const browserSessionPersistence: any;
  export const onAuthStateChanged: (authInstance: any, callback: (user: any) => void) => () => void;
  export const setPersistence: (authInstance: any, persistence: any) => Promise<void>;
  export const sendPasswordResetEmail: (authInstance: any, email: string) => Promise<any>;
  export const signInWithEmailAndPassword: (authInstance: any, email: string, password: string) => Promise<any>;
  export const signOut: (authInstance: any) => Promise<void>;
  export const collection: (...args: any[]) => any;
  export const addDoc: (ref: any, data: any) => Promise<any>;
  export const doc: (...args: any[]) => any;
  export const setDoc: (ref: any, data: any, options?: any) => Promise<void>;
  export const updateDoc: (ref: any, data: any) => Promise<void>;
  export const deleteDoc: (ref: any) => Promise<void>;
  export const query: (...args: any[]) => any;
  export const orderBy: (...args: any[]) => any;
  export const getDoc: (ref: any) => Promise<any>;
  export const serverTimestamp: () => any;
  export const onSnapshot: (queryRef: any, callback: (snapshot: any) => void, onError?: (error: any) => void) => () => void;
}
