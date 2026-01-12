'use server';

/**
 * @fileOverview An AI agent that recommends accommodations based on user preferences.
 * 
 * - recommendAccommodations - A function that recommends accommodations.
 * - AccommodationPreferencesInput - The input type for the recommendAccommodations function.
 * - AccommodationRecommendationsOutput - The return type for the recommendAccommodations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AccommodationPreferencesInputSchema = z.object({
  preferences: z
    .string()
    .describe('User preferences for accommodations (e.g., quiet, family-friendly, near the beach).'),
  bookingHistory: z
    .string()
    .describe('A summary of the user booking history.'),
  searchCriteria: z
    .string()
    .describe('The users current search criteria (e.g. location, price range, dates).'),
});
export type AccommodationPreferencesInput = z.infer<
  typeof AccommodationPreferencesInputSchema
>;

const AccommodationRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('A list of recommended accommodations based on the user preferences.'),
});
export type AccommodationRecommendationsOutput = z.infer<
  typeof AccommodationRecommendationsOutputSchema
>;

export async function recommendAccommodations(
  input: AccommodationPreferencesInput
): Promise<AccommodationRecommendationsOutput> {
  return recommendAccommodationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'accommodationRecommendationsPrompt',
  input: {schema: AccommodationPreferencesInputSchema},
  output: {schema: AccommodationRecommendationsOutputSchema},
  prompt: `You are an expert travel assistant that recommends accommodations to users.\n\n  Based on the user's preferences, booking history, and current search criteria, provide a list of recommended accommodations.\n\n  Preferences: {{{preferences}}}\n  Booking History: {{{bookingHistory}}}\n  Search Criteria: {{{searchCriteria}}}\n\n  Recommendations:`, // Ensure that the agent provides the recommended accommodations
});

const recommendAccommodationsFlow = ai.defineFlow(
  {
    name: 'recommendAccommodationsFlow',
    inputSchema: AccommodationPreferencesInputSchema,
    outputSchema: AccommodationRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
