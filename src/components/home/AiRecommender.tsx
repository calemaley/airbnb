'use client';

import { useState } from 'react';
import { Bot, Loader2, Sparkles } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecommendations('');
    setError(null);
    setLoading(true);

    try {
      const input: AccommodationPreferencesInput = {
        preferences: preferences,
        bookingHistory: 'N/A', // Not used in the new prompt
        searchCriteria: 'N/A', // Not used in the new prompt
      };
      const result = await recommendAccommodations(input);
      if (result?.recommendations) {
        setRecommendations(result.recommendations);
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <Sparkles className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-3xl font-headline font-bold md:text-4xl">
          StaysKenya Assistant
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Have a question? Ask our AI assistant.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Ask a question</CardTitle>
            <CardDescription>e.g., "How do I post a listing?" or "Which areas are supported?"</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Textarea
                placeholder="Your question..."
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
                    Ask Assistant
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
                    <p className="mt-4 font-medium text-muted-foreground">Our AI is thinking...</p>
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
                            Answer:
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
                    <p className="mt-4 font-medium text-muted-foreground">The answer will appear here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
