'use client';

import { useUser, useFirestore, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Loader2, CalendarX2 } from 'lucide-react';
import { collection, query, where } from 'firebase/firestore';
import type { Booking } from '@/lib/types';
import { BookingItem } from '@/components/dashboard/BookingItem';

export default function MyBookingsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const bookingsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(
        collection(firestore, 'bookings'), 
        where('guestId', '==', user.uid)
    );
  }, [user, firestore]);

  const { data: bookingsData, loading: bookingsLoading } = useCollection<Booking>(bookingsQuery);

  const bookings = useMemo(() => {
    if (!bookingsData) return [];
    return [...bookingsData].sort((a,b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime());
  }, [bookingsData]);


  if (loading || bookingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-[calc(100vh-8rem)]">
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-headline font-bold text-primary mb-2">My Bookings</h1>
                <p className="text-muted-foreground mb-8">An overview of your past and upcoming trips.</p>

                <div className="space-y-8">
                    {bookings && bookings.length > 0 ? (
                        bookings.map(booking => (
                           <BookingItem key={booking.id} booking={booking} perspective="guest" />
                        ))
                    ) : (
                        <div className="text-center bg-background p-12 rounded-lg border border-dashed">
                             <CalendarX2 className="h-16 w-16 mx-auto text-muted-foreground mb-4"/>
                             <h2 className="text-2xl font-bold font-headline">No Bookings Yet</h2>
                             <p className="text-muted-foreground mt-2">You haven't made any bookings. Start exploring to find your next stay!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}
