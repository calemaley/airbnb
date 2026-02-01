'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { AccommodationCard } from '@/components/listings/AccommodationCard';
import {
  UserCheck,
  ShieldCheck,
  MessageSquareHeart,
  Search,
  Calendar,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function GuestPage() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-1');

  const firestore = useFirestore();

  const featuredListingsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'listings'), limit(4));
  }, [firestore]);

  const { data: featuredListings, loading } = useCollection(featuredListingsQuery);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">
            Your Sanctuary in Meru Awaits
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-white/90">
            Discover curated homes, authentic hospitality, and unforgettable stays.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/listings">Explore Stays</Link>
          </Button>
        </div>
      </section>

      {/* Trust & Credibility Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-background p-4 rounded-full shadow-sm">
                <UserCheck className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-headline font-semibold text-2xl mt-4">Verified Hosts</h3>
              <p className="text-muted-foreground mt-2">
                Every host is vetted to ensure a safe and welcoming experience for you.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-background p-4 rounded-full shadow-sm">
                <ShieldCheck className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-headline font-semibold text-2xl mt-4">Direct Communication</h3>
              <p className="text-muted-foreground mt-2">
                Connect directly with property owners to confirm details before you book.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-background p-4 rounded-full shadow-sm">
                <MessageSquareHeart className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-headline font-semibold text-2xl mt-4">Authentic Reviews</h3>
              <p className="text-muted-foreground mt-2">
                Read genuine feedback from past guests to book with complete confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stays */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
              Featured Stays
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              A selection of our most loved and highly-rated properties.
            </p>
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
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/listings">View All Listings</Link>
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-12">
            Your Journey to Comfort
          </h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border hidden md:block" />
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-border md:hidden" />
            <div className="relative flex flex-col items-center bg-background px-4">
              <div className="bg-secondary p-4 rounded-full border mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-headline">1. Discover</h3>
              <p className="text-muted-foreground mt-2">
                Browse our curated collection of stays and find your perfect match.
              </p>
            </div>
            <div className="relative flex flex-col items-center bg-background px-4">
              <div className="bg-secondary p-4 rounded-full border mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-headline">2. Connect & Book</h3>
              <p className="text-muted-foreground mt-2">
                Contact the host directly to confirm availability and finalize your booking
                details.
              </p>
            </div>
            <div className="relative flex flex-col items-center bg-background px-4">
              <div className="bg-secondary p-4 rounded-full border mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-headline">3. Enjoy</h3>
              <p className="text-muted-foreground mt-2">
                Arrive and enjoy your stay, knowing everything is arranged and verified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Ready to Find Your Perfect Stay?
          </h2>
          <p className="mt-4 text-lg text-secondary-foreground max-w-2xl mx-auto">
            Explore unique homes in Meru and start planning your next getaway.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/listings">Start Exploring</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
