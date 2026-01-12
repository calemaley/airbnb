"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Gift } from 'lucide-react';
import { getActiveHostCount } from '@/lib/host-data';
import { cn } from '@/lib/utils';

export default function NotificationBar() {
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // We get the active host count client-side to avoid hydration mismatches, 
    // but the function itself can run on the server, which is fine.
    const activeHostCount = getActiveHostCount();
    const isOfferActive = activeHostCount < 5;

    useEffect(() => {
        setIsMounted(true);
        const dismissed = localStorage.getItem('notificationDismissed');
        if (!dismissed && isOfferActive) {
            setIsVisible(true);
        }
    }, [isOfferActive]);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('notificationDismissed', 'true');
    };

    if (!isMounted || !isVisible) {
        return null;
    }

    return (
        <div className={cn(
            "bg-foreground text-background text-center p-2 text-sm transition-all duration-300",
            isVisible ? "h-auto opacity-100" : "h-0 opacity-0 p-0"
        )}>
            <div className="container mx-auto flex items-center justify-center relative">
                <Gift className="h-4 w-4 mr-2 hidden sm:inline-block" />
                <span className="font-medium">Founding Hosts Invitation</span>
                <span className="mx-2 hidden md:inline-block">—</span>
                <span className="hidden md:inline-block">The first five hosts to join StaysKenya receive a complimentary one-year listing.</span>
                <Link href="/signup" className="ml-2 underline hover:text-primary transition-colors font-semibold">
                    Learn More
                </Link>
                <button
                    onClick={handleDismiss}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-background/70 hover:text-background"
                    aria-label="Dismiss notification"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
