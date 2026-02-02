export type Amenity = 'wifi' | 'pool' | 'parking' | 'kitchen' | 'ac' | 'tv' | 'hot-shower' | 'netflix';

export type Category = 'Budget' | 'Mid-range' | 'Luxury';

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  userId: string;
}

export interface Accommodation {
  id: string;
  name: string;
  location: string;
  category: Category;
  pricePerNight: number;
  priceType: 'Fixed' | 'Negotiable';
  description: string;
  images: string[];
  amenities: (Amenity | string)[];
  rating: number;
  reviews: Review[];
  host?: {
    name: string;
    avatar: string;
  };
  userId: string;
  hostName?: string;
  hostPhoneNumber?: string;
  lat?: number;
  lng?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface Booking {
  id: string;
  listingId: string;
  guestId?: string | null;
  hostId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  guests: number;
  status: 'confirmed';
  listing?: Accommodation;
  guest?: UserProfile;
  paymentRef?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}
