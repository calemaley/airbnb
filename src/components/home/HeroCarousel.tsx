'use client';

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getAllListings } from '@/lib/data';
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const premiumListings = getAllListings().filter(listing => listing.category === 'Luxury');
  const premiumImageIds = premiumListings.map(listing => listing.images[0]);
  const carouselImages = PlaceHolderImages.filter(p => premiumImageIds.includes(p.id));

  return (
    <Carousel
      className="absolute inset-0 w-full h-full"
      plugins={[plugin.current]}
      opts={{ loop: true }}
    >
      <CarouselContent>
        {carouselImages.map((image, index) => (
          <CarouselItem key={image.id}>
            <div className="relative h-[60vh] md:h-[70vh] w-full">
              <Image
                src={image.imageUrl}
                alt={image.description}
                data-ai-hint={image.imageHint}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
