
"use client"

import React, { useState } from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { addDoc, collection } from "firebase/firestore"
import { useFirestore, useUser, useStorage } from "@/firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { suggestCategory, type SuggestCategoryInput } from "@/ai/flows/category-suggestion";

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
import { Loader2, Sparkles, Bot } from "lucide-react";

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
  const storage = useStorage();
  const { user } = useUser();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSuggestCategory = async () => {
    if (!aiDescription) {
      setAiError("Please enter a description first.");
      return;
    }
    setIsSuggesting(true);
    setAiError(null);
    try {
      const input: SuggestCategoryInput = { description: aiDescription };
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
    if (!firestore || !user || !storage) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to post a listing.",
      });
      return;
    }

    if (imageFiles.length === 0) {
        toast({ variant: "destructive", title: "Images Required", description: "Please upload at least one image for your listing." });
        return;
    }

    setIsSubmitting(true);
    
    try {
        const uploadPromises = imageFiles.map(file => {
            const fileRef = ref(storage, `listings/${user.uid}/${Date.now()}_${file.name}`);
            return uploadBytes(fileRef, file).then(snapshot => getDownloadURL(snapshot.ref));
        });

        const imageUrls = await Promise.all(uploadPromises);
    
        const newListingData = {
          ...values,
          userId: user.uid,
          rating: 0,
          images: imageUrls,
          reviews: [],
        };
        
        const listingsCollection = collection(firestore, "listings");

        addDoc(listingsCollection, newListingData)
          .catch((serverError) => {
              const permissionError = new FirestorePermissionError({
                path: 'listings',
                operation: 'create',
                requestResourceData: newListingData,
              });
              errorEmitter.emit('permission-error', permissionError);
          });
        
        toast({
          title: "Listing Submitted!",
          description: "Your listing has been submitted and is now live!",
        });
        form.reset();
        setImageFiles([]);
        const fileInput = document.getElementById('images') as HTMLInputElement;
        if(fileInput) fileInput.value = '';

    } catch(error: any) {
        console.error("Submission process failed:", error);
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: error.message || "Could not submit your listing.",
        });
    } finally {
        setIsSubmitting(false);
    }
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
                        <FormLabel className="text-lg flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            AI Category Suggestion
                        </FormLabel>
                        <FormDescription>
                        Paste a short review or description below and our AI will suggest the best category for your property.
                        </FormDescription>
                        <div className="flex gap-2">
                            <FormControl>
                                <Textarea 
                                    rows={3} 
                                    placeholder="e.g., A simple and clean room, great for travelers on a budget." 
                                    value={aiDescription}
                                    onChange={(e) => setAiDescription(e.target.value)}
                                    disabled={isSuggesting}
                                />
                            </FormControl>
                            <Button 
                                type="button" 
                                onClick={handleSuggestCategory} 
                                disabled={isSuggesting || !aiDescription}
                                className="h-auto"
                            >
                                {isSuggesting ? <Loader2 className="animate-spin" /> : <Bot />}
                                <span className="sr-only">Suggest Category</span>
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
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
                            <Input id="images" type="file" multiple accept="image/*" onChange={handleFileChange} disabled={isSubmitting}/>
                        </FormControl>
                        <FormDescription>Select one or more images for your listing.</FormDescription>
                    </FormItem>


                    <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : "Submit Listing for Review"}
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  )
}

    