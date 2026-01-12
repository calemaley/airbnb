import { getListingById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Rating } from '@/components/ui/rating';
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
  Phone,
  MessageCircle,
  MapPin,
  Waves
} from 'lucide-react';
import type { Amenity } from '@/lib/types';

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
        </div>
      </div>
      
      <Carousel className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
        <CarouselContent>
          {listingImages.map((image, index) => image && (
            <CarouselItem key={index}>
              <div className="relative h-96">
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
                <span className="font-bold">KES {listing.pricePerNight.toLocaleString()}</span> / night
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button size="lg" className="w-full text-lg h-12">Book Now</Button>
               <p className="text-center text-muted-foreground text-sm">Contact host</p>
               <div className="grid grid-cols-2 gap-2">
                 <Button variant="outline"><Phone className="mr-2"/> Call</Button>
                 <Button variant="outline"><MessageCircle className="mr-2"/> WhatsApp</Button>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
