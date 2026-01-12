
import { ShieldCheck, UserCheck, MessageSquareHeart } from 'lucide-react';

export default function TrustAndSafetyPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Trust & Safety</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Your peace of mind is our priority. Learn about the measures we take to ensure a safe and trustworthy community.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-card border rounded-lg">
                <div className="flex justify-center mb-4">
                    <div className="bg-secondary p-4 rounded-full">
                        <UserCheck className="h-10 w-10 text-primary" />
                    </div>
                </div>
                <h2 className="font-headline font-semibold text-2xl mb-2">Verified Hosts</h2>
                <p className="text-muted-foreground">
                    Every host on StaysKenya goes through a verification process. We confirm identities and review listings to maintain a high standard of quality and safety for our guests.
                </p>
            </div>
            <div className="p-6 bg-card border rounded-lg">
                <div className="flex justify-center mb-4">
                    <div className="bg-secondary p-4 rounded-full">
                        <ShieldCheck className="h-10 w-10 text-primary" />
                    </div>
                </div>
                <h2 className="font-headline font-semibold text-2xl mb-2">Secure Payments</h2>
                <p className="text-muted-foreground">
                    Our platform uses secure, industry-standard payment gateways. Your financial information is encrypted and never shared with hosts, ensuring your transactions are always safe.
                </p>
            </div>
            <div className="p-6 bg-card border rounded-lg">
                <div className="flex justify-center mb-4">
                    <div className="bg-secondary p-4 rounded-full">
                        <MessageSquareHeart className="h-10 w-10 text-primary" />
                    </div>
                </div>
                <h2 className="font-headline font-semibold text-2xl mb-2">Authentic Reviews</h2>
                <p className="text-muted-foreground">
                    Only guests who have completed a stay can leave a review. This ensures that all feedback is genuine and based on real experiences, helping you book with confidence.
                </p>
            </div>
        </div>
        <div className="max-w-4xl mx-auto mt-16 text-center text-foreground/80 text-lg">
            <h3 className="font-headline font-bold text-2xl mb-4">Our Commitment</h3>
            <p>
                We are committed to fostering a respectful and reliable community. If you ever encounter an issue that compromises your safety or trust, our support team is available to help resolve it. Travel with peace of mind, knowing that we're here to support you.
            </p>
        </div>
      </div>
    </div>
  );
}
