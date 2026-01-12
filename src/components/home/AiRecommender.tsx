'use client';

import { useState } from 'react';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { useFlow } from '@genkit-ai/next/client';
import {
  AccommodationPreferencesInput,
  recommendAccommodations,
} from '@/ai/flows/accommodation-recommendations';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AiRecommender() {
  const [preferences, setPreferences] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const { run: recommendAccommodationsFlow, data, error, loading } = useFlow(recommendAccommodations);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecommendations('');
    const input: AccommodationPreferencesInput = {
      preferences: preferences,
      bookingHistory: 'User has previously booked a family-friendly villa in Diani and a business apartment in Nairobi.',
      searchCriteria: 'Looking for a stay in the Maasai Mara for 2 adults for 3 nights in July.',
    };
    const result = await recommendAccommodationsFlow(input);
    if (result?.recommendations) {
      setRecommendations(result.recommendations);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <Sparkles className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-3xl font-headline font-bold md:text-4xl">
          Personalized Recommendations
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Tell us what you're looking for, and our AI will find the perfect stay for you.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Describe Your Perfect Stay</CardTitle>
            <CardDescription>e.g., "A quiet place near the beach for a family of 4" or "A budget-friendly room with good WiFi for remote work."</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Textarea
                placeholder="Your preferences..."
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                rows={5}
                className="text-base"
              />
              <Button type="submit" disabled={loading || !preferences}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Get Recommendations
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="h-full">
            {loading && (
                <div className="flex flex-col items-center justify-center h-full rounded-lg border border-dashed p-8 text-center animate-pulse">
                    <Bot className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 font-medium text-muted-foreground">Our AI is finding the best spots for you...</p>
                </div>
            )}
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>An Error Occurred</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            )}
            {recommendations && (
                <Card className="bg-background shadow-lg h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Here are your recommendations:
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                            {recommendations}
                        </div>
                    </CardContent>
                </Card>
            )}
            {!loading && !recommendations && !error && (
                 <div className="flex flex-col items-center justify-center h-full rounded-lg border border-dashed p-8 text-center">
                    <Bot className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 font-medium text-muted-foreground">Your personalized recommendations will appear here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
