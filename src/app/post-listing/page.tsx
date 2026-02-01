"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { addDoc, collection } from "firebase/firestore"
import { useFirestore, useUser } from "@/firebase"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

const amenities = [
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'parking', label: 'Free Parking' },
  { id: 'kitchen', label: 'Full Kitchen' },
  { id: 'ac', label: 'Air Conditioning' },
  { id: 'tv', label: 'Television' },
] as const;

const formSchema = z.object({
  name: z.string().min(5, "Title must be at least 5 characters long."),
  location: z.string().min(3, "Location is required."),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  pricePerNight: z.coerce.number().min(1000, "Price must be at least KES 1000."),
  category: z.enum(["Budget", "Mid-range", "Luxury"]),
  amenities: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one amenity.",
  }),
})

export default function PostListingPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      pricePerNight: 5000,
      category: "Mid-range",
      amenities: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to post a listing.",
      });
      return;
    }

    form.control.register('name', { disabled: true });
    
    const newListingData = {
      ...values,
      userId: user.uid,
      rating: 0,
      images: [], // Placeholder for future implementation
      reviews: [],
    };
    
    const listingsCollection = collection(firestore, "listings");

    addDoc(listingsCollection, newListingData)
      .then(() => {
        toast({
          title: "Listing Submitted!",
          description: "Your listing has been submitted and is now live!",
        });
        form.reset();
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: listingsCollection.path,
          operation: 'create',
          requestResourceData: newListingData,
        });
        errorEmitter.emit('permission-error', permissionError);
        
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: serverError.message || "Could not submit your listing.",
        });
      })
      .finally(() => {
        form.control.register('name', { disabled: false });
      });
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Post Your Airbnb</CardTitle>
                <CardDescription>Fill out the form below to list your property on StaysKenya. Our team will review it for approval.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-lg">Property Title</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Serene Farm Stay with Mountain View" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <div className="grid md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-lg">Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Makutano, Meru Town" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pricePerNight"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-lg">Price per Night (KES)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormDescription>Price per night (KES)</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-lg">Description</FormLabel>
                        <FormControl>
                            <Textarea rows={6} placeholder="Tell guests about your place..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormItem>
                        <FormLabel className="text-lg">AI Category Suggestion</FormLabel>
                        <FormDescription>
                        Paste a short review or description below and AI will suggest the best category for your property.
                        </FormDescription>
                        <FormControl>
                            <Textarea rows={3} placeholder="e.g., A simple and clean room, great for travelers on a budget." disabled/>
                        </FormControl>
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-lg">Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="Budget">Budget</SelectItem>
                                <SelectItem value="Mid-range">Mid-range</SelectItem>
                                <SelectItem value="Luxury">Luxury</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="amenities"
                        render={() => (
                            <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-lg">Amenities</FormLabel>
                                <FormDescription>Select all that apply.</FormDescription>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {amenities.map((item) => (
                                <FormField
                                key={item.id}
                                control={form.control}
                                name="amenities"
                                render={({ field }) => {
                                    return (
                                    <FormItem
                                        key={item.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                        <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                            return checked
                                                ? field.onChange([...field.value, item.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                    (value) => value !== item.id
                                                    )
                                                )
                                            }}
                                        />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                        {item.label}
                                        </FormLabel>
                                    </FormItem>
                                    )
                                }}
                                />
                            ))}
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel className="text-lg">Upload Images</FormLabel>
                        <FormControl>
                            <Input type="file" multiple disabled />
                        </FormControl>
                        <FormDescription>Image uploads are not implemented in this demo. This is a placeholder.</FormDescription>
                    </FormItem>


                    <Button type="submit" size="lg" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Submitting..." : "Submit Listing for Review"}
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  )
}
