
'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AccommodationCard } from '@/components/listings/AccommodationCard';
import { getFeaturedListings } from '@/lib/data';
import AiRecommender from '@/components/home/AiRecommender';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"

export default function Home() {
  const featuredListings = getFeaturedListings();
  const carouselImages = PlaceHolderImages.filter(p => ['listing-2', 'listing-3', 'listing-6', 'listing-7'].includes(p.id))
  
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
         <Carousel
          plugins={[plugin.current]}
          opts={{
            loop: true,
          }}
          className="absolute inset-0 w-full h-full"
        >
          <CarouselContent className="h-full">
            {carouselImages.map((image, index) => (
              <CarouselItem key={image.id} className="h-full">
                <div className="relative h-full w-full">
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
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container px-4 -mt-16">
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 md:p-8 shadow-2xl border">
                 <div className=" text-center">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
                        Find Airbnbs & Guest Rooms in Meru
                    </h1>
                    <p className="mt-2 max-w-2xl mx-auto text-lg md:text-xl text-foreground/80">
                        Starting with Meru, expanding across Kenya.
                    </p>
                    <div className="mt-6 w-full max-w-2xl mx-auto">
                        <form className="flex flex-col sm:flex-row gap-2">
                        <Input
                            type="text"
                            placeholder="Search by location, e.g., 'Meru Town', 'Imenti'"
                            className="h-14 text-lg"
                        />
                        <Button type="submit" size="lg" className="h-14 text-lg">
                            <Search className="mr-2 h-5 w-5" />
                            Search
                        </Button>
                        </form>
                        <p className="text-sm mt-2 text-muted-foreground">More counties coming soon.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>


      <section className="container mx-auto px-4 -mt-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-headline font-bold">Featured Stays</h2>
          <Button variant="link" asChild>
            <Link href="/listings">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {featuredListings.map((listing) => (
            <AccommodationCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="bg-secondary">
        <AiRecommender />
      </section>
    </div>
  );
}
