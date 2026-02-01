
'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams, useRouter, notFound } from 'next/navigation';
import { useDoc, useFirestore, useUser } from '@/firebase';
import { doc, addDoc, collection } from 'firebase/firestore';
import type { Accommodation, Booking } from '@/lib/types';
import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { Loader2, Calendar, Users, BedDouble, Mail, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import Link from 'next/link';
import Script from 'next/script';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function BookPageContents() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const firestore = useFirestore();
    const { user, loading: userLoading } = useUser();
    const { toast } = useToast();
    const [isProcessingBooking, setIsProcessingBooking] = useState(false);

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

    const saveBooking = (paymentResponse: any) => {
        if (!listing || !firestore || !checkInDate || !checkOutDate || !user) {
            toast({ variant: 'destructive', title: 'Error', description: 'Booking data is missing, cannot save.' });
            setIsProcessingBooking(false);
            return;
        }
        
        const newBooking = {
            listingId: listing.id,
            guestId: user.uid,
            hostId: listing.userId,
            checkInDate: checkInDate.toISOString(),
            checkOutDate: checkOutDate.toISOString(),
            totalPrice: totalCost,
            guests: guests,
            status: 'confirmed' as const,
            paymentRef: paymentResponse.reference,
        };

        const bookingsCollection = collection(firestore, 'bookings');
        addDoc(bookingsCollection, newBooking as Omit<Booking, 'id'>)
            .then(() => {
                toast({
                    title: 'Booking Confirmed!',
                    description: `Your payment was successful and your booking for ${listing.name} is confirmed.`,
                });
                router.push('/my-bookings');
            })
            .catch((serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: 'bookings',
                    operation: 'create',
                    requestResourceData: newBooking,
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({
                    variant: 'destructive',
                    title: 'Booking Save Failed',
                    description: 'Your payment was successful, but we could not save your booking. Please contact support with your payment reference: ' + paymentResponse.reference,
                });
            }).finally(() => {
                setIsProcessingBooking(false);
            });
    };

    const handlePayment = () => {
        if (!user) {
            const currentPath = `/book?listingId=${listingId}&checkIn=${checkInStr}&checkOut=${checkOutStr}&guests=${guestsStr}`;
            router.push('/login?redirect=' + encodeURIComponent(currentPath));
            return;
        }

        if (!listing || !user.email) {
            toast({ variant: 'destructive', title: 'Error', description: 'Booking or user data is missing.' });
            return;
        }

        if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
             toast({ variant: 'destructive', title: 'Configuration Error', description: 'Paystack public key is not configured.' });
             return;
        }
        
        // Using `as any` because the Paystack script is loaded externally and not available as a module
        const paystack = new (window as any).PaystackPop.setup({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
          email: user.email,
          amount: totalCost * 100, // Amount in cents
          currency: 'KES',
          ref: '' + Math.floor((Math.random() * 1000000000) + 1), // unique ref
          onSuccess: (response: any) => {
            saveBooking(response);
          },
          onClose: () => {
            toast({
              variant: 'default',
              title: 'Payment Canceled',
              description: 'Your booking was not confirmed.',
            });
            setIsProcessingBooking(false);
          },
        });
        
        setIsProcessingBooking(true);
        paystack.openIframe();
    };


    if (listingLoading || userLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!listing) {
        notFound();
    }

    return (
        <>
            <Script src="https://js.paystack.co/v1/inline.js" />
            <div className="bg-secondary min-h-[calc(100vh-8rem)]">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Review Your Booking</h1>
                        <p className="text-muted-foreground mb-8">Please review the details below before proceeding to payment.</p>

                        {!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY && (
                             <Alert variant="destructive" className="mb-6">
                                <AlertTitle>Payment Gateway Not Configured</AlertTitle>
                                <AlertDescription>
                                The Paystack API key is missing. Please add <code className="font-mono p-1 bg-background rounded">NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY</code> to your .env file.
                                </AlertDescription>
                            </Alert>
                        )}
                        
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
                                <p className="text-sm text-muted-foreground mb-4 sm:mb-0">By proceeding, you agree to the <Link href="/terms-of-service" className="underline" target="_blank">Terms of Service</Link>.</p>
                                <Button size="lg" onClick={handlePayment} disabled={isProcessingBooking || totalCost <= 0 || (user && user.uid === listing.userId) || !process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY}>
                                    {isProcessingBooking ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Processing...</> : <><CreditCard className="mr-2 h-4 w-4" />Proceed to Payment</>}
                                </Button>
                            </CardFooter>
                        </Card>
                         <Alert variant="default" className="mt-6">
                            <AlertTitle>Security Note</AlertTitle>
                            <AlertDescription>
                                For a production-ready application, payment transaction verification should be performed on a server using your Paystack Secret Key to prevent tampering. This demo confirms bookings client-side after a successful payment for simplicity.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>
        </>
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
