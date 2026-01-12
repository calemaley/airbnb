
import Link from 'next/link';
import { Hotel, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4 group">
              <Hotel className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-15deg]" />
              <span className="font-bold font-headline text-2xl">StaysKenya</span>
            </Link>
            <p className="text-sm">
              Your local guide to the perfect stay in Meru.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4 font-headline text-lg">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/listings" className="hover:underline">Listings</Link></li>
              <li><Link href="/post-listing" className="hover:underline">Become a Host</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 font-headline text-lg">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help-center" className="hover:underline">Help Center</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link href="/trust-and-safety" className="hover:underline">Trust & Safety</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 font-headline text-lg">Connect</h3>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-primary"><Facebook /></Link>
              <Link href="#" className="hover:text-primary"><Twitter /></Link>
              <Link href="#" className="hover:text-primary"><Instagram /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-primary/20 pt-8 text-center text-sm space-y-4">
          <p className='max-w-2xl mx-auto'>
            <strong>Disclaimer:</strong> Booking and payment are a private matter between the guest and the host. StaysKenya is solely an advertising platform.
          </p>
          <p>&copy; {new Date().getFullYear()} StaysKenya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
