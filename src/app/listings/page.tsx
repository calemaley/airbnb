import AllListings from '@/components/listings/AllListings';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Listings in Meru',
  description: 'Browse our full range of accommodations. Starting with Meru, we are expanding across Kenya. Use our filters to find the perfect stay that matches your needs, from location and price to specific amenities.',
};

export default function ListingsPage() {
  return (
    <div>
      <div className="bg-secondary">
        <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-headline font-bold">Explore All Accommodations</h1>
            <p className="mt-2 text-lg text-secondary-foreground max-w-2xl mx-auto">Currently featuring stays in Meru, we are expanding across Kenya. Find the perfect spot for your next adventure by filtering by location, price, and amenities.</p>
        </div>
      </div>
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="md:col-span-1">
              <div className="sticky top-20 p-6 bg-card rounded-lg shadow-sm border space-y-6">
                <div className='space-y-2'>
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className='space-y-2'>
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className='space-y-2'>
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-6 w-full mt-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </aside>
            <main className="md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton className="h-80 w-full" key={i} />
                ))}
              </div>
            </main>
          </div>
        </div>
      }>
        <AllListings />
      </Suspense>
    </div>
  );
}
