'use client';

import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumBadgeProps {
    className?: string;
}

export function PremiumBadge({ className }: PremiumBadgeProps) {
    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--premium-gold-border))] bg-[hsl(var(--premium-gold-bg))] px-3 py-1 text-xs font-medium text-[hsl(var(--premium-gold-border))] tracking-wide",
            className
        )}>
            <BadgeCheck className="h-3.5 w-3.5" />
            <span>Premium Listing</span>
        </div>
    );
}
