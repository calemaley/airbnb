import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AccommodationCard } from '@/components/listings/AccommodationCard';
import { getFeaturedListings } from '@/lib/data';
import AiRecommender from '@/components/home/AiRecommender';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const featuredListings = getFeaturedListings();
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-1");

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <section className="relative h-[60vh] md:h-[70vh] w-full">
        {heroImage && 
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        }
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Find Airbnbs & Guest Rooms in Kenya
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-neutral-200">
            Your adventure starts here. Discover unique places to stay, from serene beach houses to vibrant city apartments.
          </p>
          <div className="mt-8 w-full max-w-2xl">
            <form className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="Search by location, e.g., 'Nairobi', 'Diani'"
                className="h-14 text-lg"
              />
              <Button type="submit" size="lg" className="h-14 text-lg">
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
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
