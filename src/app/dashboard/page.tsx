'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, profile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Host Dashboard</CardTitle>
            <CardDescription>Welcome back, {profile?.name || user.email}!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>This is your dashboard. From here, you can manage your listings, view bookings, and update your profile.</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                    <Link href="/post-listing">Post a New Listing</Link>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
