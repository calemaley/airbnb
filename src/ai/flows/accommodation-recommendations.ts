'use server';

/**
 * @fileOverview An AI agent that provides information about StaysKenya.
 * 
 * - recommendAccommodations - A function that answers user questions about the platform.
 * - AccommodationPreferencesInput - The input type for the recommendAccommodations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AccommodationPreferencesInputSchema = z.object({
  preferences: z
    .string()
    .describe('User question about StaysKenya'),
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
    .describe('A helpful answer to the user\'s question.'),
});
type AccommodationRecommendationsOutput = z.infer<
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
  prompt: `You are a helpful assistant for StaysKenya.
You can only answer questions about the following topics:
- How to post a listing
- How guests contact hosts
- Which areas are currently supported

Do not answer questions about payments, booking confirmations, or any other topic. If the user asks about something else, politely state that you can only answer questions about the topics listed above.

User's question: {{{preferences}}}
`,
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
