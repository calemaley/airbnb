
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Hotel, LogOut, LayoutDashboard } from 'lucide-react';
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
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2 group">
          <Hotel className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-15deg]" />
          <span className="font-bold inline-block font-headline text-xl">StaysKenya</span>
        </Link>

        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Home</Link>
          <Link href="/listings" className="transition-colors hover:text-foreground/80 text-foreground/60">Explore Listings</Link>
          <Link href="/become-a-host" className="transition-colors hover:text-foreground/80 text-foreground/60">Become a Host</Link>
          <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About StaysKenya</Link>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          {!loading && (
            <>
              {user ? (
                <>
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
                  <Button variant="ghost" asChild>
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </>
          )}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden">
          <div className="container py-4 flex flex-col gap-4">
            <Link href="/" className="font-medium text-lg" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/listings" className="font-medium text-lg" onClick={() => setIsOpen(false)}>Explore Listings</Link>
            <Link href="/become-a-host" className="font-medium text-lg" onClick={() => setIsOpen(false)}>Become a Host</Link>
            <Link href="/about" className="font-medium text-lg" onClick={() => setIsOpen(false)}>About StaysKenya</Link>
          </div>
        </div>
      )}
    </header>
  );
}
