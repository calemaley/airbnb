'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Hotel, LogOut, LayoutDashboard, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useUser();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container relative flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <Hotel className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-15deg]" />
          <span className="font-bold inline-block font-headline text-xl">StaysKenya</span>
        </Link>

        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <nav className="flex items-center gap-8 text-sm font-medium">
                <Link href="/" className="transition-colors hover:text-primary text-foreground/80">Home</Link>
                <Link href="/listings" className="transition-colors hover:text-primary text-foreground/80">Explore Listings</Link>
                <Link href="/become-a-host" className="transition-colors hover:text-primary text-foreground/80">Become a Host</Link>
                <Link href="/about" className="transition-colors hover:text-primary text-foreground/80">About StaysKenya</Link>
            </nav>
        </div>


        <div className="flex items-center justify-end gap-2">
          <div className="hidden md:flex items-center gap-2">
            {!loading && (
                <>
                {user ? (
                    <>
                    <Button variant="ghost" asChild>
                        <Link href="/my-bookings"><CalendarDays className="mr-2"/>My Bookings</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/dashboard"><LayoutDashboard className="mr-2"/>Dashboard</Link>
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="mr-2" />
                        Logout
                    </Button>
                    </>
                ) : (
                    <>
                    </>
                )}
                </>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background/95 border-b backdrop-blur-sm">
          <div className="container py-4 flex flex-col gap-4">
            <Link href="/" className="font-medium text-lg hover:text-primary" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/listings" className="font-medium text-lg hover:text-primary" onClick={() => setIsOpen(false)}>Explore Listings</Link>
            <Link href="/become-a-host" className="font-medium text-lg hover:text-primary" onClick={() => setIsOpen(false)}>Become a Host</Link>
            <Link href="/about" className="font-medium text-lg hover:text-primary" onClick={() => setIsOpen(false)}>About StaysKenya</Link>
             {user ? (
              <>
                <Link href="/my-bookings" className="font-medium text-lg hover:text-primary" onClick={() => setIsOpen(false)}>My Bookings</Link>
                <Link href="/dashboard" className="font-medium text-lg hover:text-primary" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <Button variant="outline" className="w-full justify-start mt-2" onClick={() => { handleLogout(); setIsOpen(false); }}>
                    <LogOut className="mr-2" />
                    Logout
                </Button>
              </>
             ) : (
                <>
                </>
             )}
          </div>
        </div>
      )}
    </header>
  );
}
