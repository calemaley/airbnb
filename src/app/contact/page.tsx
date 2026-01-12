
import { Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have questions or need help? We're here for you. Reach out to us through any of the methods below.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg">
            <div className="flex items-center">
              <Mail className="h-6 w-6 text-primary mr-4" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <a href="mailto:support@stayskenya.com" className="text-muted-foreground hover:text-primary transition-colors">
                  support@stayskenya.com
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="h-6 w-6 text-primary mr-4" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-muted-foreground">+254 123 456 789</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
