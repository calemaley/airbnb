'use client';

import { useUser, useFirestore, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, LogOut, MapPin } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';
import { collection, query, where } from 'firebase/firestore';
import type { Accommodation } from '@/lib/types';
import { AccommodationCard } from '@/components/listings/AccommodationCard';

export default function DashboardPage() {
  const { user, profile, loading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const listingsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'listings'), where('userId', '==', user.uid));
  }, [user, firestore]);

  const { data: listings, loading: listingsLoading } = useCollection<Accommodation>(listingsQuery);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Host Dashboard</CardTitle>
            <CardDescription>
              Welcome back, {profile?.name || user.email}!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              This is your dashboard. From here, you can manage your listings, view
              bookings, and update your profile.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/post-listing">Post a New Listing</Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {listingsLoading && (
               <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {listings && listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {listings.map((listing) => (
                  <AccommodationCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
             !listingsLoading && <p className="text-muted-foreground">You haven't posted any listings yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
