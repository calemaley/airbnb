'use client';

import { useMemo } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Booking, Accommodation, UserProfile } from '@/lib/types';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Users, BedDouble, Mail } from 'lucide-react';

interface BookingItemProps {
  booking: Booking;
  perspective: 'host' | 'guest';
}

export function BookingItem({ booking, perspective }: BookingItemProps) {
  const firestore = useFirestore();

  const listingRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'listings', booking.listingId);
  }, [firestore, booking.listingId]);
  const { data: listing, loading: listingLoading } = useDoc<Accommodation>(listingRef);

  const userRef = useMemo(() => {
    if (!firestore) return null;
    const userId = perspective === 'host' ? booking.guestId : booking.hostId;
    return doc(firestore, 'users', userId);
  }, [firestore, booking, perspective]);
  const { data: userProfile, loading: userLoading } = useDoc<UserProfile>(userRef);

  const isLoading = listingLoading || userLoading;
  
  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (!listing || !userProfile) {
    return (
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle>Booking Data Incomplete</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Could not load all details for booking ID: {booking.id}</p>
            </CardContent>
        </Card>
    );
  }

  const imageUrl = listing.images && listing.images.length > 0 ? listing.images[0] : null;
  const personTitle = perspective === 'host' ? 'Guest' : 'Host';

  return (
    <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="relative md:h-full h-48">
                 {imageUrl ? (
                    <Image
                    src={imageUrl}
                    alt={listing.name}
                    fill
                    className="object-cover"
                    quality={100}
                    />
                ) : <div className="bg-secondary h-full w-full"/>}
            </div>
            <div className="md:col-span-2">
                 <CardHeader>
                    <Link href={`/listings/${listing.id}`} className="hover:underline">
                        <CardTitle className="font-headline text-2xl">{listing.name}</CardTitle>
                    </Link>
                    <CardDescription>{listing.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="text-primary"/>
                            <div>
                                <p className="font-semibold">Check-in</p>
                                <p>{format(new Date(booking.checkInDate), 'LLL dd, yyyy')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <Calendar className="text-primary"/>
                            <div>
                                <p className="font-semibold">Check-out</p>
                                <p>{format(new Date(booking.checkOutDate), 'LLL dd, yyyy')}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-2">
                             <Users className="text-primary"/>
                            <div>
                                <p className="font-semibold">Guests</p>
                                <p>{booking.guests}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <BedDouble className="text-primary"/>
                            <div>
                                <p className="font-semibold">{personTitle}</p>
                                <p>{userProfile.name}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-2 col-span-2">
                             <Mail className="text-primary"/>
                            <div>
                                <p className="font-semibold">Contact Email</p>
                                <p>{userProfile.email}</p>
                            </div>
                        </div>
                    </div>
                     <div className="bg-secondary text-secondary-foreground font-bold text-lg p-4 rounded-md text-center">
                        Total Price: KES {booking.totalPrice.toLocaleString()}
                    </div>
                </CardContent>
            </div>
        </div>
    </Card>
  );
}
