
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';

const standardFeatures = [
    "1 Active Listing (per property)",
    "Standard Search Placement",
    "Phone & Email Support",
    "Direct Guest Communication"
];

const premiumFeatures = [
    "1 Active Listing (per property)",
    "Priority Search Placement",
    "Featured on Homepage",
    "Priority Phone & Email Support",
    "Direct Guest Communication",
    "Premium Listing Badge",
    "Enhanced Marketing Visibility",
    "Priority Review & Approval"
];

export default function BecomeAHostPage() {
  const droneImage = PlaceHolderImages.find(p => p.id === 'marketing-drone');

  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
            Showcase Your Property on StaysKenya
          </h1>
          <p className="mt-6 text-lg text-foreground/80 max-w-3xl mx-auto">
            Join a curated collection of Meru’s finest accommodations. We’re not just another listing site — we’re your marketing partner. We offer a tier-based platform designed to give your property the visibility it deserves, connecting you with guests seeking quality and authenticity.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Standard Host Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Standard Host</CardTitle>
              <CardDescription>Perfect for getting started and listing your unique space.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4">
                {standardFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
               <Button variant="outline" className="w-full" asChild>
                    <a href="https://paystack.shop/pay/Stays" target="_blank" rel="noopener noreferrer">
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </CardFooter>
          </Card>

          {/* Premium Host Card */}
          <Card className="flex flex-col border-primary border-2 shadow-lg relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Premium Host</CardTitle>
              <CardDescription>Maximize your visibility and unlock exclusive benefits.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4">
                {premiumFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
                <Button className="w-full" asChild>
                    <a href="https://paystack.shop/pay/StaysKenya" target="_blank" rel="noopener noreferrer">
                        Go Premium <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-24">
            <Card className="overflow-hidden shadow-lg border-primary/20">
                <div className="grid md:grid-cols-2 items-center">
                    <div className="p-8 order-2 md:order-1">
                        <Badge variant="outline" className="mb-4 border-primary/50 text-primary">Marketing Bonus</Badge>
                        <h2 className="font-headline text-3xl font-bold text-primary mb-4">
                            Elevate Your Listing
                        </h2>
                        <p className="text-foreground/80 mb-6">
                            We’re not just another listing site — we’re your marketing partner. List two paid properties and receive a complimentary professional drone shoot for one of them.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                                <span><strong>Attract More Guests</strong> with stunning aerial photography that highlights your property's unique features.</span>
                            </li>
                            <li className="flex items-start">
                                <Check className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                                <span><strong>Get a Promo Video Clip</strong> for social media (Premium listings only).</span>
                            </li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-3">
                            Each property requires an individual paid plan.
                        </p>
                    </div>
                     <div className="relative h-64 md:h-full w-full order-1 md:order-2">
                        {droneImage && (
                            <Image
                                src={droneImage.imageUrl}
                                alt={droneImage.description}
                                data-ai-hint={droneImage.imageHint}
                                fill
                                quality={100}
                                className="object-cover"
                            />
                        )}
                    </div>
                </div>
            </Card>
        </div>
        
        <div className="text-center mt-16">
            <p className="text-muted-foreground">Already have an account? <Link href="/host-login" className="text-primary font-medium hover:underline">Log in to manage your listings.</Link></p>
        </div>
      </div>
    </div>
  );
}
