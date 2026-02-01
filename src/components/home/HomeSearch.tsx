'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Accommodation } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';

export default function HomeSearch() {
  const router = useRouter();
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Accommodation[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const allListingsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'listings'));
  }, [firestore]);
  const { data: allListings } = useCollection<Accommodation>(allListingsQuery);

  useEffect(() => {
    if (searchTerm.trim().length > 1 && allListings) {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = allListings.filter(
        (listing) =>
          listing.name.toLowerCase().includes(lowercasedTerm) ||
          listing.location.toLowerCase().includes(lowercasedTerm)
      );
      setSuggestions(filtered.slice(0, 5)); // Limit suggestions
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, allListings]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchContainerRef]);

  const handleSuggestionClick = (suggestionText: string) => {
    setSearchTerm(suggestionText);
    setShowSuggestions(false);
    router.push(`/listings?q=${encodeURIComponent(suggestionText)}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/listings?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchContainerRef}>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          placeholder="Search by location, e.g., 'Meru Town', 'Imenti'"
          className="h-14 text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.trim().length > 1 && setShowSuggestions(true)}
          autoComplete="off"
        />
        <Button type="submit" size="lg" className="h-14 text-lg">
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <ul>
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
                onMouseDown={() => handleSuggestionClick(suggestion.name)}
              >
                <p className="font-medium">{suggestion.name}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{suggestion.location}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-sm mt-2 text-muted-foreground">More counties coming soon.</p>
    </div>
  );
}
