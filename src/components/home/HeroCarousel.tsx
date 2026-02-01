'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import type { Accommodation } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export default function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const firestore = useFirestore();
    
  const premiumListingsQuery = useMemo(() => {
      if (!firestore) return null;
      return query(
          collection(firestore, 'listings'), 
          where('category', '==', 'Luxury'),
          limit(4)
      );
  }, [firestore]);

  const { data: premiumListings, loading } = useCollection<Accommodation>(premiumListingsQuery);

  const premiumImageUrls = useMemo(() => {
      return premiumListings?.map(listing => listing.images[0]).filter(Boolean) as string[] || [];
  }, [premiumListings]);
  
  const carouselImages = premiumImageUrls.map((url, i) => ({
      id: `premium-${i}`,
      imageUrl: url,
      description: 'Premium listing',
      imageHint: 'luxury property'
  }));

  if (loading) {
    return <Skeleton className="absolute inset-0 w-full h-full" />;
  }

  // Fallback to default hero images if no premium listings with images are found
  const defaultImages = PlaceHolderImages.filter(p => p.id.startsWith('hero-'));
  const displayImages = carouselImages.length > 0 ? carouselImages : defaultImages;

  return (
    <Carousel
      className="absolute inset-0 w-full h-full"
      plugins={[plugin.current]}
      opts={{ loop: true }}
    >
      <CarouselContent>
        {displayImages.map((image, index) => (
          <CarouselItem key={image.id}>
            <div className="relative h-[60vh] md:h-[70vh] w-full">
              <Image
                src={image.imageUrl}
                alt={image.description}
                data-ai-hint={image.imageHint}
                fill
                className="object-cover"
                priority={index === 0}
                quality={100}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
