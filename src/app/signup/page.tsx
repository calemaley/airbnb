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
import { Check } from "lucide-react"

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
];

const premiumFeatures = [
    "Up to 5 Active Listings",
    "Priority Search Placement",
    "Featured on Homepage",
    "Premium Listing Badge",
    "Phone & Email Support",
];

export default function SignupPage() {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", plan: "standard" },
  })

  function onSubmit(values: z.infer<typeof signupSchema>) {
    // Firebase signup logic would go here, along with the selected plan
    console.log(values)
    alert("Signup functionality not implemented in this demo.")
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
                            <span className="text-xl font-bold mt-2">KES 10,000 <span className="text-sm font-normal text-muted-foreground">/ year</span></span>
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

              <Button type="submit" className="w-full">
                Create Account & Proceed to Payment
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
