
import Link from 'next/link';
import { Hotel } from 'lucide-react';

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
              <li><Link href="/about" className="hover:underline">About StaysKenya</Link></li>
              <li><Link href="/listings" className="hover:underline">Explore Listings</Link></li>
              <li><Link href="/become-a-host" className="hover:underline">Become a Host</Link></li>
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
              <Link href="https://www.tiktok.com/@stayskenya?_r=1&_t=ZP-93a5Mw4YS34" className="hover:text-primary" target="_blank" rel="noopener noreferrer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z" />
                  </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-primary/20 pt-8 text-center text-sm space-y-4">
          <p className='max-w-2xl mx-auto'>
            <strong>Disclaimer:</strong> StaysKenya is an advertising service only. All transactions and agreements are a private matter between the guest and the host.
          </p>
          <p>&copy; {new Date().getFullYear()} StaysKenya. All rights reserved.</p>
          <p>Developed by Ralph tech</p>
        </div>
      </div>
    </footer>
  );
}
