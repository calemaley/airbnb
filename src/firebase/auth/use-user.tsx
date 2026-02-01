'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, DocumentData } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { useDoc } from '../firestore/use-doc';

interface UserHook {
  user: User | null;
  profile: DocumentData | null;
  loading: boolean;
  error: Error | null;
}

export const useUser = (): UserHook => {
  const auth = useAuth();
  const firestore = useFirestore();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const userDocRef = user && firestore ? doc(firestore, 'users', user.uid) : null;
  const { data: profile, loading: profileLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [auth]);

  return { user, profile, loading: loading || profileLoading, error };
};
