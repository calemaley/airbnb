
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CreditCard, Gift, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const paymentSchema = z.object({
  fullName: z.string().min(3, "Full name is required."),
  email: z.string().email("Invalid email address."),
  plan: z.enum(['standard', 'premium']),
});

interface RegistrationFormProps {
  isFreeOfferAvailable: boolean;
  activeHostCount: number;
}

export default function RegistrationForm({ isFreeOfferAvailable, activeHostCount }: RegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      fullName: "",
      email: "",
      plan: 'standard',
    },
  });

  const selectedPlan = form.watch('plan');
  const price = selectedPlan === 'premium' ? 15000 : 10000;

  function onSubmit(values: z.infer<typeof paymentSchema>) {
    setIsLoading(true);
    console.log("Processing payment to StaysKenya with:", values);

    // Simulate payment processing
    setTimeout(() => {
      // In a real app, you would check the payment status here.
      // We'll simulate a successful payment.
      const paymentSuccessful = true; 
      const isFree = isFreeOfferAvailable && values.plan === 'standard';
      const amountPaid = isFree ? 0 : price;

      if (paymentSuccessful) {
        toast({
          title: "Registration Complete!",
          description: `Your ${values.plan} listing is now active. Welcome to StaysKenya!`,
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: "There was an issue processing your subscription payment. Please try again.",
        });
      }
      setIsLoading(false);
    }, 2000);
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Activate Your Listing</CardTitle>
        <CardDescription>
          Choose your plan and pay the annual subscription fee to get your property in front of thousands of potential guests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isFreeOfferAvailable && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <Gift className="h-5 w-5 text-green-600" />
            <AlertTitle className="font-bold">You're in luck!</AlertTitle>
            <AlertDescription>
              You are one of our first {5 - activeHostCount} hosts! Your first year of the Standard Plan is completely free.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-lg">Select Your Plan</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <div className="p-4 border rounded-lg has-[:checked]:border-primary flex-1">
                            <RadioGroupItem value="standard" id="standard" className="sr-only"/>
                            <FormLabel htmlFor="standard" className="font-bold text-base cursor-pointer">
                              Standard Plan <span className="font-normal text-muted-foreground">KES 10,000/year</span>
                            </FormLabel>
                          </div>
                        </FormControl>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                           <div className="p-4 border rounded-lg has-[:checked]:border-primary flex-1">
                            <RadioGroupItem value="premium" id="premium" className="sr-only"/>
                            <FormLabel htmlFor="premium" className="font-bold text-base cursor-pointer">
                                Premium Plan <span className="font-normal text-muted-foreground">KES 15,000/year</span>
                            </FormLabel>
                          </div>
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <div>
              <FormLabel>Payment Provider</FormLabel>
              <p className="text-sm text-muted-foreground mb-2">This is a placeholder. In a real app, these would link to actual payment gateways for your subscription.</p>
              <div className="grid grid-cols-3 gap-4">
                  <Button type="button" variant="outline" className="h-16 flex-col">
                      <CreditCard className="mb-1"/> Stripe
                  </Button>
                  <Button type="button" variant="outline" className="h-16 flex-col">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1"><path d="M14.5 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 3z"/><polyline points="14 2 14 8 20 8"/><path d="m10.4 12.6.9 2.1 2.1.9-.9 2.1-2.1.9.9-2.1-2.1-.9Z"/><path d="m14 17.5.9 2.1 2.1.9-.9 2.1-2.1.9.9-2.1-2.1-.9Z"/></svg>
                      Pesapal
                  </Button>
                  <Button type="button" variant="outline" className="h-16 flex-col">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1"><path d="M14.5 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 3z"/><polyline points="14 2 14 8 20 8"/><path d="M12.91 16.52c.43.2.79.39 1.09.58 1.12.7 1.63 1.43 1.63 2.4 0 1.25-.98 2.2-2.82 2.2-2.25 0-3.56-1.32-3.56-2.8a2.53 2.53 0 0 1 1.09-2.11c.21-.13.43-.25.67-.37 1.13-.57 1.6-1.16 1.6-1.93 0-1.07-.86-1.8-2.34-1.8-1.74 0-2.62.9-2.62 2.13h-2.3c0-2.15 1.74-3.75 4.92-3.75 2.9 0 4.63 1.45 4.63 3.3 0 1.53-.8 2.5-2.23 3.2Z"/></svg>
                      PayPal
                  </Button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full text-lg h-12" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : isFreeOfferAvailable && selectedPlan === 'standard' ? (
                'Complete Free Registration'
              ) : (
                `Pay KES ${price.toLocaleString()} and Activate`
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
