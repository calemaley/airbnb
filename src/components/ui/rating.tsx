"use client";

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  className?: string;
  showText?: boolean;
}

export function Rating({ rating, totalStars = 5, size = 20, className, showText = true }: RatingProps) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} fill="hsl(var(--primary))" strokeWidth={0} style={{ width: size, height: size }} />
        ))}
        {halfStar && (
          <div style={{ width: size, height: size, position: 'relative' }}>
             <Star style={{ width: size, height: size }} className="text-primary/30" strokeWidth={1} />
             <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', overflow: 'hidden'}}>
                <Star fill="hsl(var(--primary))" strokeWidth={0} style={{ width: size, height: size }} />
             </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="text-primary/30" strokeWidth={1} style={{ width: size, height: size }} />
        ))}
      </div>
      {showText && <span className="font-medium text-sm text-foreground/80">{rating.toFixed(1)}</span>}
    </div>
  );
}
