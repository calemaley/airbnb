
import { CheckCircle } from 'lucide-react';
import RegistrationForm from '@/components/host/RegistrationForm';
import { getActiveHostCount } from '@/lib/host-data';
import { PricingCard } from '@/components/host/PricingCard';

export default function RegisterHostPage() {
  const activeHosts = getActiveHostCount();
  const isFreeOfferAvailable = activeHosts < 5;

  const standardFeatures = [
      "1 Active Listing",
      "Standard Search Placement",
      "Email Support",
      "Direct Guest Communication"
  ];

  const premiumFeatures = [
      "Up to 5 Active Listings",
      "Priority Search Placement",
      "Featured on Homepage",
      "Phone & Email Support",
      "Direct Guest Communication"
  ];

  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
            Become a Host on StaysKenya
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Join our community of hosts in Meru and start earning today. We provide the tools and support you need to succeed.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            <PricingCard 
                plan="Standard"
                price={10000}
                features={standardFeatures}
                isFreeOfferAvailable={isFreeOfferAvailable}
                activeHostCount={activeHosts}
            />
             <PricingCard 
                plan="Premium"
                price={15000}
                features={premiumFeatures}
                isPopular
            />
        </div>

        <div className="max-w-4xl mx-auto mt-16">
           <RegistrationForm isFreeOfferAvailable={isFreeOfferAvailable} activeHostCount={activeHosts} />
        </div>
      </div>
    </div>
  );
}
