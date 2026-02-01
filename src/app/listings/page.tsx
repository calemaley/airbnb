import AllListings from '@/components/listings/AllListings';

export default function ListingsPage() {
  return (
    <div>
      <div className="bg-secondary">
        <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-headline font-bold">Explore Our Stays</h1>
            <p className="mt-2 text-lg text-secondary-foreground max-w-2xl mx-auto">Find the perfect spot for your next Kenyan adventure, from budget-friendly rooms to luxurious villas.</p>
        </div>
      </div>
      <AllListings />
    </div>
  );
}
