'use client';

import { useUser, useFirestore, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, LogOut, Trash2, Pencil, CalendarX2 } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';
import { collection, query, where, doc, deleteDoc } from 'firebase/firestore';
import type { Accommodation, Booking } from '@/lib/types';
import { AccommodationCard } from '@/components/listings/AccommodationCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { BookingItem } from '@/components/dashboard/BookingItem';

export default function DashboardPage() {
  const { user, profile, loading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [listingToDelete, setListingToDelete] = useState<Accommodation | null>(null);

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
  
  const hostBookingsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(
        collection(firestore, 'bookings'), 
        where('hostId', '==', user.uid)
    );
  }, [user, firestore]);
  const { data: hostBookingsData, loading: bookingsLoading } = useCollection<Booking>(hostBookingsQuery);

  const hostBookings = useMemo(() => {
    if (!hostBookingsData) return [];
    return [...hostBookingsData].sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime());
  }, [hostBookingsData]);


  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };

  const handleDeleteClick = (e: React.MouseEvent, listing: Accommodation) => {
    e.preventDefault();
    e.stopPropagation();
    setListingToDelete(listing);
  };

  const handleDeleteConfirm = async () => {
    if (!firestore || !listingToDelete) return;
    try {
      const listingRef = doc(firestore, 'listings', listingToDelete.id);
      await deleteDoc(listingRef);
      toast({
        title: "Success",
        description: `Listing "${listingToDelete.name}" has been deleted.`,
      });
    } catch (error: any) {
      console.error("Error deleting listing:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete listing. Please try again.",
      });
    } finally {
      setListingToDelete(null);
    }
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
              This is your central hub. From here, you can manage your listings, view
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
            <CardTitle>Bookings on Your Properties</CardTitle>
             <CardDescription>Reservations made by guests on your listings.</CardDescription>
          </CardHeader>
          <CardContent>
             {bookingsLoading && (
               <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {hostBookings && hostBookings.length > 0 ? (
              <div className="space-y-6">
                {hostBookings.map((booking) => (
                  <BookingItem key={booking.id} booking={booking} perspective="host" />
                ))}
              </div>
            ) : (
             !bookingsLoading && (
                <div className="text-center py-8">
                    <CalendarX2 className="h-12 w-12 mx-auto text-muted-foreground mb-2"/>
                    <p className="text-muted-foreground">You don't have any bookings yet.</p>
                </div>
             )
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Listings</CardTitle>
             <CardDescription>Properties you are currently hosting.</CardDescription>
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
                  <div key={listing.id} className="relative group">
                    <AccommodationCard listing={listing} />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Button
                            asChild
                            variant="secondary"
                            size="icon"
                            aria-label="Edit listing"
                        >
                            <Link href={`/edit-listing/${listing.id}`}>
                                <Pencil className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button 
                          variant="destructive"
                          size="icon" 
                          onClick={(e) => handleDeleteClick(e, listing)}
                          aria-label="Delete listing"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
             !listingsLoading && <p className="text-muted-foreground">You haven't posted any listings yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {listingToDelete && (
        <AlertDialog open={!!listingToDelete} onOpenChange={(open) => !open && setListingToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the listing for "{listingToDelete.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setListingToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
