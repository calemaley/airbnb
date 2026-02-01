'use server';

/**
 * @fileOverview An AI agent that suggests a category for a property listing.
 * 
 * - suggestCategory - A function that suggests a category based on a description.
 * - SuggestCategoryInput - The input type for the suggestCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCategoryInputSchema = z.object({
  description: z.string().describe('A description of the property.'),
});
export type SuggestCategoryInput = z.infer<typeof SuggestCategoryInputSchema>;

const CategoryEnum = z.enum(['Budget', 'Mid-range', 'Luxury']);

const SuggestCategoryOutputSchema = z.object({
  category: CategoryEnum.describe(
    'The suggested category for the property. Must be one of "Budget", "Mid-range", or "Luxury".'
  ),
});
type SuggestCategoryOutput = z.infer<typeof SuggestCategoryOutputSchema>;

export async function suggestCategory(
  input: SuggestCategoryInput
): Promise<SuggestCategoryOutput> {
  return suggestCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorySuggestionPrompt',
  input: {schema: SuggestCategoryInputSchema},
  output: {schema: SuggestCategoryOutputSchema},
  prompt: `Analyze the following property description and classify it into one of the following categories: "Budget", "Mid-range", or "Luxury".

Return only the category name.

Description: {{{description}}}`,
});

const suggestCategoryFlow = ai.defineFlow(
  {
    name: 'suggestCategoryFlow',
    inputSchema: SuggestCategoryInputSchema,
    outputSchema: SuggestCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
