'use client';

import { Suspense, useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter, notFound } from 'next/navigation';
import { useDoc, useFirestore, useUser } from '@/firebase';
import { doc, addDoc, collection } from 'firebase/firestore';
import type { Accommodation } from '@/lib/types';
import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { Loader2, Calendar, Users, BedDouble, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import Link from 'next/link';

function BookPageContents() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const firestore = useFirestore();
    const { user, loading: userLoading } = useUser();
    const { toast } = useToast();
    const [isConfirming, setIsConfirming] = useState(false);

    const listingId = searchParams.get('listingId');
    const checkInStr = searchParams.get('checkIn');
    const checkOutStr = searchParams.get('checkOut');
    const guestsStr = searchParams.get('guests');

    const listingRef = useMemo(() => {
        if (!firestore || !listingId) return null;
        return doc(firestore, 'listings', listingId);
    }, [firestore, listingId]);
    const { data: listing, loading: listingLoading } = useDoc<Accommodation>(listingRef);
    
    if (!listingId || !checkInStr || !checkOutStr || !guestsStr) {
        return notFound();
    }
    
    const checkInDate = parseISO(checkInStr);
    const checkOutDate = parseISO(checkOutStr);
    const guests = parseInt(guestsStr, 10);

    const numberOfNights = differenceInCalendarDays(checkOutDate, checkInDate);
    const totalCost = listing ? listing.pricePerNight * numberOfNights : 0;
    const imageUrl = listing?.images?.[0];

    const handleConfirmBooking = async () => {
        if (!user) {
            const currentPath = `/book?listingId=${listingId}&checkIn=${checkInStr}&checkOut=${checkOutStr}&guests=${guestsStr}`;
            router.push('/login?redirect=' + encodeURIComponent(currentPath));
            return;
        }

        if (!listing || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'Listing data is missing.' });
            return;
        }

        setIsConfirming(true);

        const newBooking = {
            listingId: listing.id,
            guestId: user.uid,
            hostId: listing.userId,
            checkInDate: checkInDate.toISOString(),
            checkOutDate: checkOutDate.toISOString(),
            totalPrice: totalCost,
            guests: guests,
            status: 'confirmed' as const,
        };

        try {
            const bookingsCollection = collection(firestore, 'bookings');
            await addDoc(bookingsCollection, newBooking).catch((serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: 'bookings',
                    operation: 'create',
                    requestResourceData: newBooking,
                });
                errorEmitter.emit('permission-error', permissionError);
                throw serverError; // Re-throw to be caught by outer try-catch
            });

            toast({
                title: 'Booking Confirmed!',
                description: `Your booking for ${listing.name} is confirmed.`,
            });
            
            router.push('/my-bookings');

        } catch (error: any) {
            console.error('Booking confirmation failed:', error);
            toast({
                variant: 'destructive',
                title: 'Confirmation Failed',
                description: error.message || 'Could not confirm your booking. Please try again.',
            });
            setIsConfirming(false);
        }
    };


    if (listingLoading || userLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!listing) {
        return notFound();
    }

    return (
        <div className="bg-secondary min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-headline font-bold text-primary mb-2">Review Your Booking</h1>
                    <p className="text-muted-foreground mb-8">Please review the details below before confirming your stay.</p>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">{listing.name}</CardTitle>
                            <div className="flex items-center text-muted-foreground mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                {listing.location}
                            </div>
                        </CardHeader>
                        <CardContent>
                             {imageUrl && (
                                <div className="relative h-64 w-full rounded-lg overflow-hidden mb-6">
                                    <Image src={imageUrl} alt={listing.name} fill className="object-cover" quality={100} />
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg">Your Trip</h3>
                                        <div className="flex items-center gap-4"><Calendar className="text-primary"/> <div><p className="font-medium">Dates</p><p className="text-muted-foreground">{format(checkInDate, 'LLL dd, yyyy')} to {format(checkOutDate, 'LLL dd, yyyy')}</p></div></div>
                                        <div className="flex items-center gap-4"><Users className="text-primary"/> <div><p className="font-medium">Guests</p><p className="text-muted-foreground">{guests} guest{guests > 1 ? 's' : ''}</p></div></div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg">Host</h3>
                                         <div className="flex items-center gap-4"><BedDouble className="text-primary"/> <div><p className="font-medium">Host Name</p><p className="text-muted-foreground">{listing.hostName || 'N/A'}</p></div></div>
                                         <div className="flex items-center gap-4"><Mail className="text-primary"/> <div><p className="font-medium">Host Contact</p><p className="text-muted-foreground">{listing.hostPhoneNumber || 'N/A'}</p></div></div>
                                    </div>
                                </div>
                                
                                <Separator />

                                <div>
                                    <h3 className="font-semibold text-lg mb-4">Price Details</h3>
                                    <div className="space-y-2 text-muted-foreground">
                                        <div className="flex justify-between">
                                            <span>KES {listing.pricePerNight.toLocaleString()} x {numberOfNights} nights</span>
                                            <span>KES {totalCost.toLocaleString()}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-bold text-foreground text-lg">
                                            <span>Total (KES)</span>
                                            <span>KES {totalCost.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 p-6 flex-col sm:flex-row items-center justify-between">
                            <p className="text-sm text-muted-foreground mb-4 sm:mb-0">By confirming, you agree to the <Link href="/terms-of-service" className="underline" target="_blank">Terms of Service</Link>.</p>
                             <Button size="lg" onClick={handleConfirmBooking} disabled={isConfirming}>
                                {isConfirming ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Confirming...</> : 'Confirm & Book'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Next.js pages that use `useSearchParams` must be wrapped in a Suspense boundary.
export default function BookPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        }>
            <BookPageContents />
        </Suspense>
    );
}
