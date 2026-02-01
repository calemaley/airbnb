'use client';

import { ReactNode, useEffect, useState } from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [firebase, setFirebase] = useState(initializeFirebase());

  useEffect(() => {
    // This ensures Firebase is initialized on the client side.
    if (typeof window !== 'undefined' && !firebase.app) {
      setFirebase(initializeFirebase());
    }
  }, [firebase.app]);

  return <FirebaseProvider value={firebase}>{children}</FirebaseProvider>;
}
