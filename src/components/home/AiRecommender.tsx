
'use client';

import { useState } from 'react';
import { Bot, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import {
  AccommodationPreferencesInput,
  recommendAccommodations,
} from '@/ai/flows/accommodation-recommendations';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const isMissingApiKeyError = (error: any) => {
  return error instanceof Error && error.message.includes('GEMINI_API_KEY');
}

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
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Sparkles className="mx-auto h-12 w-12 text-primary" />
          </div>
          <CardTitle className="mt-4 text-3xl font-headline font-bold md:text-4xl">
            StaysKenya Assistant
          </CardTitle>
          <CardDescription className="mt-4 text-lg">
            Have a question? Ask our AI assistant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isMissingApiKeyError(error) ? (
             <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>AI Assistant is not configured</AlertTitle>
                <AlertDescription>
                    To enable the AI-powered assistant, you need to add your Google AI API key.
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                        <li>Obtain a free API key from <a href="https://aistudio.google.com/keys" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Google AI Studio</a>.</li>
                        <li>Create a file named <code className="bg-destructive-foreground/20 px-1 py-0.5 rounded-sm text-white">.env</code> in the root of your project.</li>
                        <li>Add the following line to the <code className="bg-destructive-foreground/20 px-1 py-0.5 rounded-sm text-white">.env</code> file:
                            <pre className="mt-1 bg-destructive-foreground/20 p-2 rounded-md text-white overflow-x-auto">GEMINI_API_KEY=YOUR_API_KEY_HERE</pre>
                        </li>
                        <li>Replace <code className="bg-destructive-foreground/20 px-1 py-0.5 rounded-sm text-white">YOUR_API_KEY_HERE</code> with your actual key and restart the development server.</li>
                    </ol>
                </AlertDescription>
            </Alert>
          ) : null }

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-4">
              <p className="font-medium">Ask a question</p>
              <p className="text-sm text-muted-foreground">e.g., "How do I post a listing?" or "Which areas are supported?"</p>
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
            </div>
            
            <div className="h-full">
                {loading && (
                    <div className="flex flex-col items-center justify-center h-full rounded-lg border border-dashed p-8 text-center animate-pulse">
                        <Bot className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 font-medium text-muted-foreground">Our AI is thinking...</p>
                    </div>
                )}
                {error && !isMissingApiKeyError(error) && (
                    <Alert variant="destructive">
                        <AlertTitle>An Error Occurred</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                )}
                {recommendations && (
                    <Card className="bg-background shadow-inner h-full border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
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
        </CardContent>
      </Card>
    </div>
  );
}
