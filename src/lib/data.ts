import type { Accommodation } from './types';

const allListings: Accommodation[] = [
  {
    id: '1',
    name: 'Serene Meru Apartment',
    location: 'Meru Town, Meru',
    category: 'Mid-range',
    pricePerNight: 7500,
    description: 'A beautiful and quiet apartment in the heart of Meru. Perfect for business travelers and couples. Close to the Meru Museum and various restaurants.',
    images: ['listing-1', 'listing-5'],
    amenities: ['wifi', 'kitchen', 'parking', 'tv'],
    rating: 4.8,
    reviews: [
      { id: 'r1', author: 'Jane Doe', rating: 5, comment: 'Amazing place! Very clean and the host was wonderful.', date: '2023-10-15' },
      { id: 'r2', author: 'John Smith', rating: 4.5, comment: 'Great location and value for money.', date: '2023-09-22' },
    ],
    host: { name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice' },
  },
  {
    id: '2',
    name: 'Imenti Forest Cottage',
    location: 'Imenti Forest, Meru',
    category: 'Luxury',
    pricePerNight: 25000,
    description: 'Experience paradise in this stunning forest cottage. Direct access to nature trails and beautiful scenery. Features a private garden.',
    images: ['listing-2', 'listing-3'],
    amenities: ['wifi', 'pool', 'ac', 'kitchen'],
    rating: 4.9,
    reviews: [
       { id: 'r3', author: 'Emily White', rating: 5, comment: 'Absolute paradise. Waking up to the sounds of the forest was a dream.', date: '2023-11-01' },
    ],
    host: { name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob' },
  },
  {
    id: '3',
    name: 'Cozy Nkubu Getaway',
    location: 'Nkubu Town, Meru',
    category: 'Budget',
    pricePerNight: 4000,
    description: 'A simple and cozy room perfect for solo travelers or couples looking to explore Meru. Clean, safe, and affordable.',
    images: ['listing-4'],
    amenities: ['wifi', 'parking'],
    rating: 4.5,
    reviews: [],
    host: { name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=charlie' },
  },
  {
    id: '4',
    name: 'Luxury Villa in a Tea Estate',
    location: 'Meru',
    category: 'Luxury',
    pricePerNight: 40000,
    description: 'An exclusive villa offering unparalleled luxury and privacy, set within a lush tea estate. Comes with a personal chef and breathtaking views of Mount Kenya.',
    images: ['listing-3', 'listing-2'],
    amenities: ['wifi', 'pool', 'ac', 'kitchen', 'parking'],
    rating: 5.0,
    reviews: [
      { id: 'r4', author: 'Michael Brown', rating: 5, comment: 'The best vacation of my life. The staff and amenities were top-notch.', date: '2023-10-05' },
    ],
    host: { name: 'Diana', avatar: 'https://i.pravatar.cc/150?u=diana' },
  },
  {
    id: '5',
    name: 'Modern Meru Town Apartment',
    location: 'Meru Town, Meru',
    category: 'Mid-range',
    pricePerNight: 6000,
    description: 'Modern apartment with stunning views of Meru. Enjoy beautiful sunsets from your private balcony. Close to the city center and popular spots.',
    images: ['listing-5', 'listing-1'],
    amenities: ['wifi', 'kitchen', 'ac', 'tv'],
    rating: 4.7,
    reviews: [],
    host: { name: 'Eve', avatar: 'https://i.pravatar.cc/150?u=eve' },
  },
  {
    id: '6',
    name: 'Lodge near Meru National Park',
    location: 'Near Meru National Park, Meru',
    category: 'Luxury',
    pricePerNight: 35000,
    description: 'A unique lodge at the foothills of Mount Kenya, close to Meru National Park. Offers guided safari tours and a chance to see diverse wildlife.',
    images: ['listing-7', 'listing-4'],
    amenities: ['wifi', 'pool', 'parking'],
    rating: 4.9,
    reviews: [],
    host: { name: 'Frank', avatar: 'https://i.pravatar.cc/150?u=frank' },
  },
   {
    id: '7',
    name: 'Charming Farm Stay',
    location: 'Timau, Meru',
    category: 'Mid-range',
    pricePerNight: 12000,
    description: 'Immerse yourself in tranquility in this beautifully rustic farm house. Located in the heart of Timau with views of Mount Kenya.',
    images: ['listing-8'],
    amenities: ['wifi', 'kitchen', 'ac'],
    rating: 4.8,
    reviews: [],
    host: { name: 'Grace', avatar: 'https://i.pravatar.cc/150?u=grace' },
  },
  {
    id: '8',
    name: 'Affordable Meru Studio',
    location: 'Meru Town, Meru',
    category: 'Budget',
    pricePerNight: 3000,
    description: 'A clean and secure studio apartment for budget-conscious travelers. Ideal for short stays and exploring Meru town.',
    images: ['listing-1'],
    amenities: ['wifi', 'kitchen', 'parking', 'tv'],
    rating: 4.4,
    reviews: [],
    host: { name: 'Heidi', avatar: 'https://i.pravatar.cc/150?u=heidi' },
  },
];

export function getAllListings(): Accommodation[] {
  return allListings;
}

export function getListingById(id: string): Accommodation | undefined {
  return allListings.find((listing) => listing.id === id);
}

export function getFeaturedListings(): Accommodation[] {
  return allListings.filter(l => ['2', '1', '4', '7'].includes(l.id));
}
