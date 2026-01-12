
import { getListingById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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
} from 'lucide-react';
import type { Amenity } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const amenityIcons: Record<Amenity, React.ReactNode> = {
  wifi: <Wifi className="h-5 w-5 mr-2" />,
  pool: <Waves className="h-5 w-5 mr-2" />,
  parking: <ParkingSquare className="h-5 w-5 mr-2" />,
  kitchen: <Utensils className="h-5 w-5 mr-2" />,
  ac: <Wind className="h-5 w-5 mr-2" />,
  tv: <Tv className="h-5 w-5 mr-2" />,
};
const amenityLabels: Record<Amenity, string> = {
  wifi: 'Wi-Fi',
  pool: 'Swimming Pool',
  parking: 'Free Parking',
  kitchen: 'Full Kitchen',
  ac: 'Air Conditioning',
  tv: 'Television',
};


export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = getListingById(params.id);

  if (!listing) {
    notFound();
  }
  
  const listingImages = listing.images
    .map((id) => PlaceHolderImages.find((p) => p.id === id))
    .filter(Boolean);

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
          {listingImages.map((image, index) => image && (
            <CarouselItem key={index}>
              <div className="relative h-[500px]">
                <Image src={image.imageUrl} alt={`${listing.name} - image ${index + 1}`} data-ai-hint={image.imageHint} fill className="object-cover" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-16" />
        <CarouselNext className="mr-16" />
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
                {amenityIcons[amenity]}
                <span className="capitalize">{amenityLabels[amenity]}</span>
              </div>
            ))}
          </div>

          <Separator className="my-8" />
          
          <h3 className="font-headline text-xl font-bold mb-4">Reviews</h3>
            {listing.reviews.length > 0 ? (
                <div className="space-y-6">
                {listing.reviews.map(review => (
                    <div key={review.id} className="bg-card p-4 rounded-lg border">
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
        </div>
        
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">
                <span className="font-bold">KES {listing.pricePerNight.toLocaleString()}</span>
                <span className="text-base font-normal text-muted-foreground"> / night</span>
              </CardTitle>
              <CardDescription>
                <Rating rating={listing.rating} size={16}/>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="check-in">Check-in</Label>
                  <Input id="check-in" type="date" disabled placeholder="Check-in date" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="check-out">Check-out</Label>
                  <Input id="check-out" type="date" disabled placeholder="Check-out date" />
                </div>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="guests">Guests</Label>
                  <Input id="guests" type="number" defaultValue={2} disabled min={1}/>
                </div>
                <p className="text-xs text-center text-muted-foreground pt-2">Booking functionality is not yet implemented.</p>

            </CardContent>
            <CardFooter className="flex-col items-stretch space-y-2">
                <Button size="lg" className="w-full text-lg h-12" disabled>Reserve</Button>
                <p className="text-center text-sm text-muted-foreground">You won't be charged yet</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
