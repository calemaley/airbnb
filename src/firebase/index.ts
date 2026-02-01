import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, Storage } from 'firebase/storage';
import { firebaseConfig } from './config';

import { FirebaseProvider, useFirebaseApp, useAuth, useFirestore, useFirebase, useStorage } from './provider';
import { FirebaseClientProvider } from './client-provider';
import { useUser } from './auth/use-user';
import { useDoc } from './firestore/use-doc';
import { useCollection } from './firestore/use-collection';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: Storage;

function initializeFirebase() {
  if (typeof window !== 'undefined') {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      firestore = getFirestore(app);
      storage = getStorage(app);
    } else {
      app = getApp();
      auth = getAuth(app);
      firestore = getFirestore(app);
      storage = getStorage(app);
    }
  }
  return { app, auth, firestore, storage };
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useUser,
  useDoc,
  useCollection,
  useFirebase,
  useFirebaseApp,
  useAuth,
  useFirestore,
  useStorage,
};
