'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccommodationCard } from '@/components/listings/AccommodationCard';
import AiRecommender from '@/components/home/AiRecommender';
import HeroCarousel from '@/components/home/HeroCarousel';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import type { Accommodation } from '@/lib/types';
import HomeSearch from '@/components/home/HomeSearch';

export default function Home() {
  const firestore = useFirestore();

  const featuredListingsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'listings'), limit(4));
  }, [firestore]);

  const { data: featuredListings, loading } = useCollection<Accommodation>(featuredListingsQuery);

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
        <HeroCarousel />
        <div className="relative z-10 container px-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-2xl">
            Find Airbnbs & Guest Rooms in Meru
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/90 drop-shadow-lg">
            Starting with Meru, expanding across Kenya.
          </p>
        </div>
      </section>

      <div className="container px-4 -mt-40 z-20 relative">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 md:p-8 shadow-2xl border">
          <div className=" text-center">
            <HomeSearch />
          </div>
        </div>
      </div>

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
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton className="h-80 w-full" key={i} />
            ))}
          {featuredListings?.map((listing) => (
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
