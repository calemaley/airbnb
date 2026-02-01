
"use client"

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { doc, updateDoc } from "firebase/firestore"
import { useFirestore, useUser, useDoc } from "@/firebase"
import { suggestCategory } from "@/ai/flows/category-suggestion";
import type { SuggestCategoryInput } from "@/ai/flows/category-suggestion";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";


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
import { Loader2, Sparkles, Bot, PlusCircle, Trash2 } from "lucide-react";
import type { Accommodation } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const amenities = [
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'parking', label: 'Free Parking' },
  { id: 'kitchen', label: 'Full Kitchen' },
  { id: 'ac', label: 'Air Conditioning' },
  { id: 'tv', label: 'Television' },
  { id: 'hot-shower', label: 'Hot Shower' },
  { id: 'netflix', label: 'Netflix' },
] as const;

const formSchema = z.object({
  name: z.string().min(5, "Title must be at least 5 characters long."),
  hostName: z.string().min(3, "Host name is required."),
  hostPhoneNumber: z.string().min(10, "A valid phone number is required."),
  location: z.string().min(3, "Location is required."),
  description: z.string().min(20, "Description must be at least 20 characters long.").max(5000, "Description must be 5000 characters or less."),
  pricePerNight: z.coerce.number().min(1000, "Price must be at least KES 1000."),
  priceType: z.enum(["Fixed", "Negotiable"]),
  category: z.enum(["Budget", "Mid-range", "Luxury"]),
  amenities: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one amenity.",
  }),
})

export default function EditListingPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user, loading: userLoading } = useUser();
  const router = useRouter();

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const listingRef = useMemo(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'listings', id);
  }, [firestore, id]);

  const { data: listing, loading: listingLoading } = useDoc<Accommodation>(listingRef);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      hostName: "",
      hostPhoneNumber: "",
      location: "",
      description: "",
      pricePerNight: 5000,
      priceType: "Fixed",
      category: "Mid-range",
      amenities: [],
    },
  });

  useEffect(() => {
    if (listing) {
      if (!userLoading && user?.uid !== listing.userId) {
        toast({ variant: "destructive", title: "Unauthorized", description: "You don't have permission to edit this listing." });
        router.push('/dashboard');
        return;
      }
      form.reset({
        ...listing,
        hostName: listing.hostName || '',
        hostPhoneNumber: listing.hostPhoneNumber || '',
      });
      setImageUrls(listing.images || []);
    }
  }, [listing, form, user, userLoading, router, toast]);

  const handleAddImageUrl = () => {
    if (currentImageUrl && currentImageUrl.startsWith('http') && !imageUrls.includes(currentImageUrl)) {
      setImageUrls([...imageUrls, currentImageUrl]);
      setCurrentImageUrl("");
    } else if (currentImageUrl && !currentImageUrl.startsWith('http')) {
        toast({
            variant: "destructive",
            title: "Invalid Image URL",
            description: "Please provide a valid web URL (starting with http:// or https://). Local file paths are not supported."
        });
    }
  };

  const handleRemoveImageUrl = (urlToRemove: string) => {
    setImageUrls(imageUrls.filter(url => url !== urlToRemove));
  };


  const handleSuggestCategory = async () => {
    const description = form.getValues("description");
    if (!description) {
      setAiError("Please write a description first.");
      return;
    }
    setIsSuggesting(true);
    setAiError(null);
    try {
      const input: SuggestCategoryInput = { description };
      const result = await suggestCategory(input);
      if (result?.category) {
        form.setValue("category", result.category);
        toast({
          title: "Category Suggested",
          description: `We've selected the "${result.category}" category for you based on your description.`,
        });
      } else {
        throw new Error("AI did not return a category.");
      }
    } catch (error: any) {
      console.error("AI Category Suggestion Error:", error);
      setAiError(error.message || "Failed to get AI suggestion.");
      toast({
        variant: "destructive",
        title: "Suggestion Failed",
        description: "Could not get an AI category suggestion. Please select one manually.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !user || !listing) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to edit a listing.",
      });
      return;
    }

    if (imageUrls.length === 0) {
        toast({ variant: "destructive", title: "Images Required", description: "Please add at least one image URL." });
        return;
    }

    setIsSubmitting(true);
    
    try {
      const updatedListingData = {
        ...values,
        images: imageUrls,
      };
      
      const listingDocRef = doc(firestore, "listings", listing.id);

      updateDoc(listingDocRef, updatedListingData)
        .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
              path: listingDocRef.path,
              operation: 'update',
              requestResourceData: updatedListingData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
      
      toast({
        title: "Listing Updated!",
        description: "Your listing has been successfully updated.",
      });
      
      router.push("/dashboard");

    } catch(error: any) {
        console.error("Update process failed:", error);
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: error.message || "Could not update your listing. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (listingLoading || userLoading) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  if (!listing) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Edit Your Listing</CardTitle>
                <CardDescription>Update the details of your property below.</CardDescription>
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
                            name="hostName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-lg">Host Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. John Doe" {...field} />
                                </FormControl>
                                <FormDescription>Your name that will be displayed to guests.</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="hostPhoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-lg">Host Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 0712345678" {...field} />
                                </FormControl>
                                <FormDescription>Your phone number for guests to contact you.</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

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
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="priceType"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-lg">Price Type</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex items-center space-x-4"
                                    >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="Fixed" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Fixed</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="Negotiable" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Negotiable</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                        <FormLabel className="text-lg flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            AI Category Suggestion
                        </FormLabel>
                        <FormDescription>
                          Click the button below and our AI will suggest the best category based on your property description.
                        </FormDescription>
                        <div className="flex gap-2">
                            <Button 
                                type="button" 
                                onClick={handleSuggestCategory} 
                                disabled={isSuggesting || !form.watch("description")}
                            >
                                {isSuggesting ? <Loader2 className="animate-spin" /> : <Bot />}
                                <span className="ml-2">Suggest Category</span>
                            </Button>
                        </div>
                        {aiError && <p className="text-sm font-medium text-destructive">{aiError}</p>}
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-lg">Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
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
                                                ? field.onChange([...(field.value || []), item.id])
                                                : field.onChange(
                                                    (field.value || [])?.filter(
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
                        <FormLabel className="text-lg">Image URLs</FormLabel>
                        <FormDescription>Paste direct links to your images below and click "Add URL". You can add multiple images.</FormDescription>
                        <div className="flex gap-2">
                            <FormControl>
                                <Input 
                                    placeholder="https://i.ibb.co/6RrSLTFc/airbnb6.jpg"
                                    value={currentImageUrl}
                                    onChange={(e) => setCurrentImageUrl(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </FormControl>
                            <Button type="button" onClick={handleAddImageUrl} disabled={!currentImageUrl || isSubmitting}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add URL
                            </Button>
                        </div>
                        
                        {imageUrls.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4">
                                {imageUrls.map((url, index) => (
                                    <div key={index} className="relative group aspect-square">
                                        <Image src={url} alt={`Listing image ${index + 1}`} fill className="object-cover rounded-md border" quality={100} />
                                        <Button 
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleRemoveImageUrl(url)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </FormItem>


                    <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting || listingLoading}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Updating...</> : "Save Changes"}
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  )
}
