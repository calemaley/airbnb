import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Hotel } from 'lucide-react';
import type { Accommodation } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Rating } from '@/components/ui/rating';
import { PremiumBadge } from '../ui/premium-badge';

interface AccommodationCardProps {
  listing: Accommodation;
}

export function AccommodationCard({ listing }: AccommodationCardProps) {
  const imageUrl = listing.images && listing.images.length > 0 ? listing.images[0] : null;

  return (
    <Card className="w-full overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <Link href={`/listings/${listing.id}`} className="block">
        <div className="relative h-56 w-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={listing.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
              <Hotel size={48} />
            </div>
          )}
          {listing.category === 'Luxury' ? (
              <PremiumBadge className="absolute top-2 right-2"/>
          ) : (
             <Badge className="absolute top-2 right-2" variant={'secondary'}>
                {listing.category}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-headline text-lg font-bold truncate">{listing.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{listing.location}</span>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="font-bold text-lg">KES {listing.pricePerNight.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground"> / night</span>
            </div>
            {listing.rating > 0 && <Rating rating={listing.rating} size={16} />}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
