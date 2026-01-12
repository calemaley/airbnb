"use server";

import * as z from "zod";

const formSchema = z.object({
  name: z.string(),
  location: z.string(),
  description: z.string(),
  pricePerNight: z.number(),
  category: z.enum(["Budget", "Mid-range", "Luxury"]),
  amenities: z.array(z.string()),
});

export async function postListingAction(values: z.infer<typeof formSchema>) {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: "Invalid fields." };
  }

  // In a real application, you would save this data to your database (e.g., Firestore)
  // and handle image uploads (e.g., to Firebase Storage).
  console.log("New listing submitted for approval:", validatedFields.data);

  // Simulate a delay for processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Here you would also trigger the admin approval flow.

  return { success: true };
}
