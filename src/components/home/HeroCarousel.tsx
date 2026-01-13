
'use client';

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getFeaturedListings } from '@/lib/data';
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const featuredListings = getFeaturedListings();
const featuredImageIds = featuredListings.map(listing => listing.images[0]);
const carouselImages = PlaceHolderImages.filter(p => featuredImageIds.includes(p.id));

export default function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <Carousel
      className="absolute inset-0 w-full h-full"
      plugins={[plugin.current]}
      opts={{ loop: true }}
    >
      <CarouselContent>
        {carouselImages.map((image) => (
          <CarouselItem key={image.id}>
            <div className="relative h-[60vh] md:h-[70vh] w-full">
              <Image
                src={image.imageUrl}
                alt={image.description}
                data-ai-hint={image.imageHint}
                fill
                className="object-cover"
                priority={image.id === 'listing-2'}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
