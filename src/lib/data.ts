import type { Accommodation } from './types';

const allListings: Accommodation[] = [
  {
    id: '1',
    name: 'Serene Nairobi Apartment',
    location: 'Kilimani, Nairobi',
    category: 'Mid-range',
    pricePerNight: 75,
    description: 'A beautiful and quiet apartment in the heart of Nairobi. Perfect for business travelers and couples. Close to Yaya Centre and various restaurants.',
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
    name: 'Diani Beachfront Cottage',
    location: 'Diani Beach, Kwale',
    category: 'Luxury',
    pricePerNight: 250,
    description: 'Experience paradise in this stunning beachfront cottage. Direct access to the white sandy beaches of Diani. Features a private pool and garden.',
    images: ['listing-2', 'listing-3'],
    amenities: ['wifi', 'pool', 'ac', 'kitchen'],
    rating: 4.9,
    reviews: [
       { id: 'r3', author: 'Emily White', rating: 5, comment: 'Absolute paradise. Waking up to the ocean view was a dream.', date: '2023-11-01' },
    ],
    host: { name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob' },
  },
  {
    id: '3',
    name: 'Cozy Nakuru Getaway',
    location: 'Nakuru Town, Nakuru',
    category: 'Budget',
    pricePerNight: 40,
    description: 'A simple and cozy room perfect for solo travelers or couples looking to explore Nakuru National Park. Clean, safe, and affordable.',
    images: ['listing-4'],
    amenities: ['wifi', 'parking'],
    rating: 4.5,
    reviews: [],
    host: { name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=charlie' },
  },
  {
    id: '4',
    name: 'Luxury Villa in Malindi',
    location: 'Malindi, Kilifi',
    category: 'Luxury',
    pricePerNight: 400,
    description: 'An exclusive villa offering unparalleled luxury and privacy. Comes with a personal chef, a large infinity pool, and breathtaking ocean views.',
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
    name: 'Kisumu Lakeside Apartment',
    location: 'Milimani, Kisumu',
    category: 'Mid-range',
    pricePerNight: 60,
    description: 'Modern apartment with stunning views of Lake Victoria. Enjoy beautiful sunsets from your private balcony. Close to the city center and popular spots.',
    images: ['listing-5', 'listing-1'],
    amenities: ['wifi', 'kitchen', 'ac', 'tv'],
    rating: 4.7,
    reviews: [],
    host: { name: 'Eve', avatar: 'https://i.pravatar.cc/150?u=eve' },
  },
  {
    id: '6',
    name: 'Mount Kenya Safari Lodge',
    location: 'Nanyuki, Laikipia',
    category: 'Luxury',
    pricePerNight: 350,
    description: 'A unique lodge at the foothills of Mount Kenya. Offers guided safari tours, horseback riding, and a chance to see the Big Five.',
    images: ['listing-7', 'listing-4'],
    amenities: ['wifi', 'pool', 'parking'],
    rating: 4.9,
    reviews: [],
    host: { name: 'Frank', avatar: 'https://i.pravatar.cc/150?u=frank' },
  },
   {
    id: '7',
    name: 'Swahili Gem in Lamu Old Town',
    location: 'Lamu Island, Lamu',
    category: 'Mid-range',
    pricePerNight: 120,
    description: 'Immerse yourself in history in this beautifully restored Swahili house. Located in the heart of Lamu\'s UNESCO World Heritage site.',
    images: ['listing-8'],
    amenities: ['wifi', 'kitchen', 'ac'],
    rating: 4.8,
    reviews: [],
    host: { name: 'Grace', avatar: 'https://i.pravatar.cc/150?u=grace' },
  },
  {
    id: '8',
    name: 'Affordable Eldoret Studio',
    location: 'Eldoret Town, Uasin Gishu',
    category: 'Budget',
    pricePerNight: 30,
    description: 'A clean and secure studio apartment for budget-conscious travelers. Ideal for short stays and exploring the North Rift region.',
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
