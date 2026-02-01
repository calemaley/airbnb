'use client';
import {useState, useEffect} from 'react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  const [currentDate, setCurrentDate] = useState('');
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="bg-background">
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Terms of Service</h1>
                {currentDate && <p className="mt-4 text-lg text-muted-foreground">
                    Last updated: {currentDate}
                </p>}
                </div>
                <div className="space-y-8 text-foreground/80 text-lg">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold font-headline">1. Introduction</h2>
                        <p>Welcome to StaysKenya ("we," "our," "us"). By accessing or using our platform, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, do not use our platform. These Terms apply to all visitors, users, and others who access or use the Service.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold font-headline">2. Service Description</h2>
                        <p>StaysKenya provides an online platform that connects hosts who have accommodations to rent with guests seeking to rent such accommodations. Our service is limited to providing an advertising platform. We are not a party to any rental agreement or other transaction between users. All transactions and agreements are a private matter between the guest and the host.</p>
                        <p>We do not own, create, sell, resell, provide, control, manage, offer, deliver, or supply any listings. Hosts are solely responsible for their listings.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold font-headline">3. User Conduct and Responsibilities</h2>
                        <p>You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and you agree that you will not disclose your password to any third party.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold font-headline">4. Bookings and Financial Terms</h2>
                        <p>Hosts are solely responsible for honoring any confirmed bookings and making available any accommodations reserved through the platform. Guests agree to pay the host the agreed-upon fees for any booking requested.</p>
                        <p><strong>Disclaimer:</strong> StaysKenya is an advertising service only. All financial transactions are handled directly between the guest and the host. We are not responsible for any payment disputes, refunds, or financial losses.</p>
                    </div>
                    
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold font-headline">5. Limitation of Liability</h2>
                        <p>The platform is provided "as is," without warranty of any kind, either express or implied. In no event will StaysKenya be liable for any direct, indirect, special, incidental, or consequential damages arising out of the use or inability to use the platform.</p>
                    </div>

                     <div className="space-y-2">
                        <h2 className="text-2xl font-bold font-headline">6. Changes to Terms</h2>
                        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold font-headline">7. Contact Us</h2>
                        <p>If you have any questions about these Terms, please <Link href="/contact" className="text-primary underline">contact us</Link>.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
