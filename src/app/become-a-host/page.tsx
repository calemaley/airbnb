

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Gift, Airplay } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getActiveHostCount } from '@/lib/host-data';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
    "Phone & Email Support",
    "Direct Guest Communication",
    "Premium Listing Badge"
];

export default function BecomeAHostPage() {
    const activeHostCount = getActiveHostCount();
    const isFreeOfferAvailable = activeHostCount < 5;
    const droneImage = PlaceHolderImages.find(p => p.id === 'marketing-drone');

  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
            Showcase Your Property on StaysKenya
          </h1>
          <p className="mt-6 text-lg text-foreground/80 max-w-3xl mx-auto">
            Join a curated collection of Meru’s finest accommodations. We offer a tier-based platform designed to give your property the visibility it deserves, connecting you with guests seeking quality and authenticity.
          </p>
        </div>

        {isFreeOfferAvailable && (
          <Alert className="max-w-4xl mx-auto mt-8 bg-green-50 border-green-200 text-green-800">
            <Gift className="h-5 w-5 text-green-600" />
            <AlertTitle className="font-bold">Limited-Time Offer!</AlertTitle>
            <AlertDescription>
                Be one of our first 5 hosts and receive your first year on the Standard Plan for free! 
                Only {5 - activeHostCount} spots remaining. <Link href="/signup" className='font-bold underline'>Sign up now.</Link>
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
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
                    <Link href="/signup">
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
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
                    <Link href="/signup">
                        Go Premium <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="max-w-4xl mx-auto mt-16">
            <Card className="relative overflow-hidden border-2 border-primary/20 bg-card shadow-lg">
                <Badge className="absolute top-4 right-4" variant="outline">Marketing Bonus</Badge>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">We’re not just another listing site — we’re your marketing partner.</CardTitle>
                    <CardDescription className="text-lg pt-2">
                        Supercharge your listing's appeal with our exclusive marketing bonus for new partners.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-5 gap-8 items-center">
                        <div className="md:col-span-3">
                            <h4 className="font-bold text-xl mb-4 flex items-center">
                                <Airplay className="h-6 w-6 mr-3 text-primary" />
                                Complimentary Professional Drone Shoot
                            </h4>
                            <p className="text-muted-foreground mb-4">
                                Hosts who list two paid properties receive one complimentary professional drone shoot for one selected property. Each property is listed and paid for individually.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                                    <span><strong>Attract More Guests:</strong> High-quality aerial photography makes your property stand out.</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                                    <span><strong>Enhance Premium Listings:</strong> Drone shoot includes high-quality aerial photography and (Premium listings only) a short promotional video clip.</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                                    <span><strong>Boost Your Marketing:</strong> Use professional assets to maximize your booking potential.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="md:col-span-2 relative h-56 w-full rounded-lg overflow-hidden">
                            {droneImage && (
                                <Image
                                    src={droneImage.imageUrl}
                                    alt={droneImage.description}
                                    data-ai-hint={droneImage.imageHint}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="text-center mt-16">
            <p className="text-muted-foreground">Have an account? <Link href="/login" className="text-primary font-medium hover:underline">Log in to manage your listings.</Link></p>
        </div>
      </div>
    </div>
  );
}
