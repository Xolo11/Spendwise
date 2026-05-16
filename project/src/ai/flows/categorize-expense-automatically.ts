'use server';
/**
 * @fileOverview This file implements a Genkit flow for automatically categorizing user expenses.
 *
 * - categorizeExpenseAutomatically - A function that categorizes an expense based on its description.
 * - CategorizeExpenseAutomaticallyInput - The input type for the categorizeExpenseAutomatically function.
 * - CategorizeExpenseAutomaticallyOutput - The return type for the categorizeExpenseAutomatically function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeExpenseAutomaticallyInputSchema = z.object({
  description: z.string().describe('The description of the expense.'),
});
export type CategorizeExpenseAutomaticallyInput = z.infer<
  typeof CategorizeExpenseAutomaticallyInputSchema
>;

const CategorizeExpenseAutomaticallyOutputSchema = z.object({
  category: z
    .enum([
      'Food & Dining',
      'Transportation',
      'Utilities',
      'Shopping',
      'Entertainment',
      'Healthcare',
      'Education',
      'Rent/Mortgage',
      'Bills',
      'Groceries',
      'Travel',
      'Miscellaneous',
    ])
    .describe(
      'The categorized expense type, chosen from a predefined list. If no specific category fits, use "Miscellaneous".'
    ),
});
export type CategorizeExpenseAutomaticallyOutput = z.infer<
  typeof CategorizeExpenseAutomaticallyOutputSchema
>;

export async function categorizeExpenseAutomatically(
  input: CategorizeExpenseAutomaticallyInput
): Promise<CategorizeExpenseAutomaticallyOutput> {
  return categorizeExpenseAutomaticallyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeExpenseAutomaticallyPrompt',
  input: {schema: CategorizeExpenseAutomaticallyInputSchema},
  output: {schema: CategorizeExpenseAutomaticallyOutputSchema},
  prompt: `You are an AI assistant specialized in categorizing financial expenses.

Given the expense description below, determine the most appropriate category from the following list:
- Food & Dining
- Transportation
- Utilities
- Shopping
- Entertainment
- Healthcare
- Education
- Rent/Mortgage
- Bills
- Groceries
- Travel
- Miscellaneous

If the description does not clearly fit into any of the specific categories, assign it to 'Miscellaneous'.

Expense Description: {{{description}}}`,
});

const categorizeExpenseAutomaticallyFlow = ai.defineFlow(
  {
    name: 'categorizeExpenseAutomaticallyFlow',
    inputSchema: CategorizeExpenseAutomaticallyInputSchema,
    outputSchema: CategorizeExpenseAutomaticallyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
