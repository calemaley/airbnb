'use client';

import { useMemo, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Rating } from '@/components/ui/rating';
import { PremiumBadge } from '@/components/ui/premium-badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Wifi,
  ParkingSquare,
  Utensils,
  Tv,
  Wind,
  MapPin,
  Waves,
  Loader2,
  AlertCircle,
  ShowerHead,
  Clapperboard,
  User as UserIcon,
  Phone,
  Star,
} from 'lucide-react';
import type { Amenity, Accommodation, Booking, Review } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDoc, useFirestore, useUser, useCollection } from '@/firebase';
import { doc, collection, query, where, addDoc, updateDoc } from 'firebase/firestore';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, differenceInCalendarDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const amenityIcons: Record<Amenity, React.ReactNode> = {
  wifi: <Wifi className="h-5 w-5 mr-2" />,
  pool: <Waves className="h-5 w-5 mr-2" />,
  parking: <ParkingSquare className="h-5 w-5 mr-2" />,
  kitchen: <Utensils className="h-5 w-5 mr-2" />,
  ac: <Wind className="h-5 w-5 mr-2" />,
  tv: <Tv className="h-5 w-5 mr-2" />,
  'hot-shower': <ShowerHead className="h-5 w-5 mr-2" />,
  netflix: <Clapperboard className="h-5 w-5 mr-2" />,
};
const amenityLabels: Record<Amenity, string> = {
  wifi: 'Wi-Fi',
  pool: 'Swimming Pool',
  parking: 'Free Parking',
  kitchen: 'Full Kitchen',
  ac: 'Air Conditioning',
  tv: 'Television',
  'hot-shower': 'Hot Shower',
  netflix: 'Netflix',
};

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const { user, profile } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [date, setDate] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  const listingRef = useMemo(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'listings', params.id);
  }, [firestore, params.id]);

  const { data: listing, loading } = useDoc<Accommodation>(listingRef);

  const bookingsQuery = useMemo(() => {
    if (!firestore || !params.id) return null;
    return query(collection(firestore, 'bookings'), where('listingId', '==', params.id));
  }, [firestore, params.id]);

  const { data: bookings } = useCollection<Booking>(bookingsQuery);

  const disabledDates = useMemo(() => {
    const dates: Date[] = [];
    bookings?.forEach(booking => {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      for (let d = new Date(checkIn); d <= checkOut; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
    });
    return dates;
  }, [bookings]);

  const canReview = useMemo(() => {
    if (!user || !bookings || !listing) return false;
    
    const hasCompletedBooking = bookings.some(b => 
        b.guestId === user.uid && new Date(b.checkOutDate) < new Date()
    );

    const hasAlreadyReviewed = listing.reviews.some(r => r.userId === user.uid);

    return hasCompletedBooking && !hasAlreadyReviewed;
  }, [user, bookings, listing]);


  const handleReserve = async () => {
    if (!user) {
      router.push('/login?redirect=/listings/' + params.id);
      return;
    }
    if (!listing || !date?.from || !date?.to) {
       toast({
        variant: "destructive",
        title: "Incomplete Information",
        description: "Please select your check-in and check-out dates.",
      });
      return;
    }

    setIsBooking(true);
    try {
      const numberOfNights = differenceInCalendarDays(date.to, date.from);
      if (numberOfNights <= 0) {
        throw new Error("Check-out date must be after check-in date.");
      }

      const newBooking = {
        listingId: listing.id,
        guestId: user.uid,
        hostId: listing.userId,
        checkInDate: date.from.toISOString(),
        checkOutDate: date.to.toISOString(),
        totalPrice: listing.pricePerNight * numberOfNights,
        guests,
        status: 'confirmed' as const,
      };

      await addDoc(collection(firestore, 'bookings'), newBooking);

      toast({
        title: "Booking Successful!",
        description: `You've booked ${listing.name}. Check "My Bookings" for details.`,
        duration: 5000,
      });

      router.push('/my-bookings');

    } catch(e: any) {
      console.error("Booking failed:", e);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: e.message || "Could not complete your booking. Please try again.",
      });
    } finally {
      setIsBooking(false);
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile || !listing || !listingRef) return;
    if (reviewRating === 0 || !reviewComment) {
        toast({ variant: 'destructive', title: 'Incomplete Review', description: 'Please provide a rating and a comment.' });
        return;
    }
    setIsSubmittingReview(true);
    try {
        const newReview: Review = {
            id: user.uid, // Using user id to ensure one review per user per listing
            userId: user.uid,
            author: profile.name,
            rating: reviewRating,
            comment: reviewComment,
            date: new Date().toISOString(),
        };

        const newReviews = [...listing.reviews, newReview];
        const newTotalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
        const newAverageRating = newTotalRating / newReviews.length;

        await updateDoc(listingRef, {
            reviews: newReviews,
            rating: newAverageRating,
        });

        toast({ title: 'Review Submitted', description: 'Thank you for your feedback!' });
        setReviewComment('');
        setReviewRating(0);
    } catch (error: any) {
        console.error('Failed to submit review:', error);
        toast({ variant: 'destructive', title: 'Submission Failed', description: error.message });
    } finally {
        setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) {
    notFound();
  }
  
  const listingImages = listing.images || [];
  const numberOfNights = date?.from && date?.to ? differenceInCalendarDays(date.to, date.from) : 0;
  const totalCost = numberOfNights > 0 ? numberOfNights * listing.pricePerNight : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-headline text-4xl font-bold">{listing.name}</h1>
        <div className="flex items-center text-muted-foreground mt-2 text-lg gap-4">
          <Rating rating={listing.rating} size={20}/>
          <span className="text-muted-foreground">•</span>
          <div className="flex items-center">
             <MapPin className="h-5 w-5 mr-1" />
             <span>{listing.location}</span>
          </div>
          {listing.category === 'Luxury' && (
            <>
                <span className="text-muted-foreground">•</span>
                <PremiumBadge />
            </>
          )}
        </div>
      </div>
      
      <Carousel className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
        <CarouselContent>
          {listingImages.length > 0 ? listingImages.map((imageUrl, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[500px]">
                <Image src={imageUrl} alt={`${listing.name} - image ${index + 1}`} fill className="object-cover" quality={100} priority={index === 0}/>
              </div>
            </CarouselItem>
          )) : (
            <CarouselItem>
               <div className="relative h-[500px] bg-secondary flex items-center justify-center">
                  <p className="text-muted-foreground">No images available for this listing.</p>
               </div>
            </CarouselItem>
          )}
        </CarouselContent>
        {listingImages.length > 1 && (
          <>
            <CarouselPrevious className="ml-16" />
            <CarouselNext className="mr-16" />
          </>
        )}
      </Carousel>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="font-headline text-2xl font-bold">About this place</h2>
          <p className="mt-4 text-lg text-foreground/80">{listing.description}</p>
          
          <Separator className="my-8" />

          <h3 className="font-headline text-xl font-bold mb-4">What this place offers</h3>
          <div className="grid grid-cols-2 gap-4">
            {listing.amenities.map(amenity => (
              <div key={amenity} className="flex items-center">
                {amenityIcons[amenity as Amenity]}
                <span className="capitalize">{amenityLabels[amenity as Amenity]}</span>
              </div>
            ))}
          </div>

          {(listing.hostName || listing.hostPhoneNumber) && (
            <>
              <Separator className="my-8" />
              <div>
                <h3 className="font-headline text-xl font-bold mb-4">Host Information</h3>
                <div className="flex flex-col sm:flex-row gap-6 text-lg">
                  {listing.hostName && (
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-5 w-5 text-primary" />
                      <span>{listing.hostName}</span>
                    </div>
                  )}
                  {listing.hostPhoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      <a href={`tel:${listing.hostPhoneNumber}`} className="hover:underline">{listing.hostPhoneNumber}</a>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator className="my-8" />
          
          <h3 className="font-headline text-xl font-bold mb-4">Reviews</h3>
            {listing.reviews && listing.reviews.length > 0 ? (
                <div className="space-y-6">
                {listing.reviews.map((review, index) => (
                    <div key={review.id || index} className="bg-card p-4 rounded-lg border">
                        <div className="flex items-start">
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-bold">{review.author}</p>
                                    <Rating rating={review.rating} size={16} showText={false}/>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{new Date(review.date).toLocaleDateString()}</p>
                                <p className="mt-2 text-foreground/90">{review.comment}</p>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-muted-foreground">No reviews for this listing yet.</p>
            )}

            {canReview && (
              <>
                <Separator className="my-8" />
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">Leave a Review</CardTitle>
                        <CardDescription>Share your experience to help other travelers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                                <Label>Your Rating</Label>
                                <div className="flex gap-1 mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button type="button" key={star} onClick={() => setReviewRating(star)}>
                                        <Star className={cn("h-8 w-8 transition-colors", star <= reviewRating ? "text-primary fill-primary" : "text-gray-300 hover:text-primary/50")} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <Label htmlFor="reviewComment">Your Comment</Label>
                                <Textarea 
                                    id="reviewComment"
                                    className="mt-2"
                                    rows={4}
                                    placeholder="How was your stay?"
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={isSubmittingReview}>
                                {isSubmittingReview ? <><Loader2 className="animate-spin mr-2"/> Submitting...</> : "Submit Review"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
              </>
            )}
        </div>
        
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <span className="font-bold">KES {listing.pricePerNight.toLocaleString()}</span>
                <span className="text-base font-normal text-muted-foreground"> / night</span>
                 {listing.priceType && <Badge variant="secondary" className="ml-2">{listing.priceType}</Badge>}
              </CardTitle>
              <CardDescription>
                <Rating rating={listing.rating} size={16}/>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Select Dates</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={1}
                      disabled={day => disabledDates.some(disabled => format(disabled, 'y-MM-dd') === format(day, 'y-MM-dd')) || day < new Date(new Date().setHours(0,0,0,0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

               <div className="space-y-2">
                  <Label htmlFor="guests">Guests</Label>
                  <Input id="guests" type="number" value={guests} onChange={e => setGuests(Number(e.target.value))} min={1} max={10}/>
                </div>
                
                {user && user.uid === listing.userId && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>This is your listing</AlertTitle>
                    <AlertDescription>
                      You cannot book your own property.
                    </AlertDescription>
                  </Alert>
                )}

            </CardContent>
            <CardFooter className="flex-col items-stretch space-y-2">
               {totalCost > 0 && (
                <div className='rounded-lg bg-muted/50 p-4 space-y-2'>
                    <div className='flex justify-between'><span>KES {listing.pricePerNight.toLocaleString()} x {numberOfNights} nights</span> <span>KES {totalCost.toLocaleString()}</span></div>
                     <Separator/>
                    <div className='flex justify-between font-bold text-lg'><span>Total</span> <span>KES {totalCost.toLocaleString()}</span></div>
                </div>
               )}
                <Button size="lg" className="w-full text-lg h-12" onClick={handleReserve} disabled={isBooking || !date?.from || !date?.to || (user && user.uid === listing.userId)}>
                  {isBooking ? <Loader2 className="animate-spin" /> : "Reserve"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">You won't be charged yet</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
