
"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check, Gift, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { activateNewHost, getActiveHostCount } from "@/lib/host-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    plan: z.enum(['standard', 'premium'], {
        required_error: "You need to select a hosting plan."
    }),
})

const standardFeatures = [
    "1 Active Listing",
    "Standard Search Placement",
    "Email Support",
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


// In a real app, this data would likely come from an API route or server component props
// For this demo, we call the server-side function directly (Next.js allows this in client components)
const activeHostCount = getActiveHostCount();
const isFreeOfferAvailable = activeHostCount < 5;

export default function SignupPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", plan: "standard" },
  })

  const selectedPlan = form.watch('plan');
  const isFreeStandardPlan = isFreeOfferAvailable && selectedPlan === 'standard';

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);

    const price = values.plan === 'premium' ? 15000 : 10000;
    const finalPrice = isFreeStandardPlan ? 0 : price;

    console.log(`Simulating payment of KES ${finalPrice} for ${values.plan} plan...`);

    // Simulate network delay for payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real application, this is where you would integrate with Stripe/Pesapal
    // and handle the response. For now, we'll assume it's always successful.
    const paymentSuccessful = true;

    if (paymentSuccessful) {
        // In a real app, you would create the user account in your database (e.g., Firebase) here.
        console.log("Payment successful. Creating user account:", values);
        
        // This is a simulation. In a real app, this would be a transactional database operation.
        activateNewHost();

        toast({
            title: "Registration Successful!",
            description: `Welcome to StaysKenya! Your ${values.plan} account is now active.`,
        });
        form.reset();
    } else {
        toast({
            variant: "destructive",
            title: "Payment Failed",
            description: "There was an issue processing your payment. Please try again or contact support.",
        });
    }

    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-secondary py-12">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Become a Host</CardTitle>
          <CardDescription>
            Choose your plan and create an account to start listing your property.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFreeOfferAvailable && (
            <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                <Gift className="h-5 w-5 text-green-600" />
                <AlertTitle className="font-bold">You're in luck!</AlertTitle>
                <AlertDescription>
                You are eligible for a free first year on the Standard Plan as one of our first {5} hosts! Only {5 - activeHostCount} free spots remain.
                </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-lg font-semibold">Select Your Plan</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="standard" id="standard" className="sr-only" />
                          </FormControl>
                          <FormLabel htmlFor="standard" className="flex flex-col p-4 border rounded-lg cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:border-2 has-[:checked]:shadow-md h-full">
                            <span className="font-bold text-lg">Standard Host</span>
                            {isFreeOfferAvailable ? (
                                <>
                                    <span className="text-xl font-bold mt-2 text-green-600">FREE <span className="text-sm font-normal text-muted-foreground line-through">KES 10,000</span></span>
                                    <span className="text-sm font-normal text-green-700">First Year Free</span>
                                </>
                            ) : (
                                <span className="text-xl font-bold mt-2">KES 10,000 <span className="text-sm font-normal text-muted-foreground">/ year</span></span>
                            )}
                            <ul className="space-y-2 mt-4 text-sm flex-1">
                                {standardFeatures.map(feat => (
                                    <li key={feat} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary"/> <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>
                          </FormLabel>
                        </FormItem>
                         <FormItem>
                          <FormControl>
                            <RadioGroupItem value="premium" id="premium" className="sr-only" />
                          </FormControl>
                          <FormLabel htmlFor="premium" className="flex flex-col p-4 border rounded-lg cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:border-2 has-[:checked]:shadow-md h-full">
                            <span className="font-bold text-lg">Premium Host</span>
                             <span className="text-xl font-bold mt-2">KES 15,000 <span className="text-sm font-normal text-muted-foreground">/ year</span></span>
                             <ul className="space-y-2 mt-4 text-sm flex-1">
                                {premiumFeatures.map(feat => (
                                    <li key={feat} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary"/> <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    isFreeStandardPlan ? "Complete Free Registration" : `Create Account & Proceed to Payment`
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline font-medium hover:text-primary">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
