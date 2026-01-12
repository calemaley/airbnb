
import { CheckCircle } from 'lucide-react';
import RegistrationForm from '@/components/host/RegistrationForm';
import { getActiveHostCount } from '@/lib/host-data';

export default function RegisterHostPage() {
  const activeHosts = getActiveHostCount();
  const isFreeOfferAvailable = activeHosts < 5;

  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
            Become a Host on StaysKenya
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Join our community of hosts and start earning today. We provide the tools and support you need to succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mt-16 items-start">
          <div className="bg-card p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-headline font-bold mb-6">Why Host With Us?</h2>
            <ul className="space-y-4 text-lg">
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                <span><span className="font-bold">Local Focus:</span> We are a platform dedicated entirely to the Kenyan market.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                <span><span className="font-bold">Simple Pricing:</span> No hidden fees. Just a straightforward annual subscription.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                <span><span className="font-bold">Automated Activation:</span> Your listing goes live the moment your payment is confirmed.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                <span><span className="font-bold">Secure Payments:</span> We partner with industry-leading payment providers for your security.</span>
              </li>
            </ul>
            <div className="mt-8 bg-secondary border border-primary/20 p-6 rounded-lg">
              <h3 className="font-headline text-xl font-semibold text-primary">Simple Annual Pricing</h3>
              <p className="text-5xl font-bold mt-2">$99 <span className="text-lg font-normal text-muted-foreground">/ year</span></p>
              <p className="mt-2 text-muted-foreground">This flat fee covers your listing's activation for one year. No commissions, no surprises.</p>
            </div>
          </div>
          
          <RegistrationForm isFreeOfferAvailable={isFreeOfferAvailable} activeHostCount={activeHosts} />

        </div>
      </div>
    </div>
  );
}
