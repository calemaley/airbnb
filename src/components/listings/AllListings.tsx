'use client';

import { useState, useMemo } from 'react';
import type { Accommodation } from '@/lib/types';
import { AccommodationCard } from './AccommodationCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { useSearchParams } from 'next/navigation';

const MAX_PRICE = 50000;

export default function AllListings() {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);

  const firestore = useFirestore();
  const listingsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'listings'));
  }, [firestore]);

  const { data: listings, loading, error } = useCollection<Accommodation>(listingsQuery);

  const filteredListings = useMemo(() => {
    if (!listings) return [];
    
    return listings.filter((listing) => {
      const matchesSearch =
        listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || listing.category === category;
      const matchesPrice =
        listing.pricePerNight >= priceRange[0] &&
        (priceRange[1] === MAX_PRICE ? true : listing.pricePerNight <= priceRange[1]);
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [listings, searchTerm, category, priceRange]);

  const resetFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setPriceRange([0, MAX_PRICE]);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters */}
        <aside className="md:col-span-1">
          <div className="sticky top-20 p-6 bg-card rounded-lg shadow-sm border">
            <h3 className="font-headline text-xl font-bold mb-6">Filter Results</h3>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium">Search</label>
                <Input
                  type="text"
                  placeholder="Name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Budget">Budget</SelectItem>
                    <SelectItem value="Mid-range">Mid-range</SelectItem>
                    <SelectItem value="Luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Price Range (KES)</label>
                <Slider
                  min={0}
                  max={MAX_PRICE}
                  step={1000}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value)}
                  className="mt-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{priceRange[0].toLocaleString()}</span>
                  <span>{priceRange[1].toLocaleString()}{priceRange[1] === MAX_PRICE && '+'}</span>
                </div>
              </div>
               <Button onClick={resetFilters} variant="secondary" className="w-full">
                Reset Filters
              </Button>
            </div>
          </div>
        </aside>

        {/* Listings Grid */}
        <main className="md:col-span-3">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton className="h-80 w-full" key={i} />
              ))}
            </div>
          )}
          {!loading && error && (
            <div className="text-center py-16">
              <h3 className="font-headline text-2xl font-bold text-destructive">Error Loading Listings</h3>
              <p className="text-muted-foreground mt-2">Could not fetch listings. Please try again later.</p>
            </div>
          )}
          {!loading && !error && filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.map((listing) => (
                <AccommodationCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            !loading && !error && (
              <div className="text-center py-16">
                <h3 className="font-headline text-2xl font-bold">No Listings Found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
