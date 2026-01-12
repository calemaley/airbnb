import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Leaf, ShieldCheck, Heart } from 'lucide-react';

export default function AboutPage() {
    const aboutImage = PlaceHolderImages.find(p => p.id === 'hero-1');

    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">About StaysKenya</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        Connecting you with the heart of Kenya, one stay at a time.
                    </p>
                </div>

                <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg mb-16">
                    {aboutImage &&
                        <Image
                            src={aboutImage.imageUrl}
                            alt={aboutImage.description}
                            data-ai-hint={aboutImage.imageHint}
                            fill
                            className="object-cover"
                        />
                    }
                    <div className="absolute inset-0 bg-black/30" />
                </div>

                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-headline font-bold mb-4">Our Mission</h2>
                    <p className="text-lg mb-8 text-foreground/80">
                        StaysKenya was born from a simple idea: to make discovering and booking unique, local accommodations in Kenya easier and more trustworthy than ever. We are a platform built with a deep appreciation for Kenya's diverse landscapes and rich culture. Our goal is to empower local hosts and provide travelers with authentic experiences, whether it's a bustling city apartment in Nairobi, a serene beachfront cottage in Diani, or a rustic safari lodge in the Maasai Mara.
                    </p>

                    <h2 className="text-3xl font-headline font-bold mb-6">Why Trust StaysKenya?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6 bg-card border rounded-lg">
                            <div className="flex justify-center mb-4">
                                <div className="bg-secondary p-4 rounded-full">
                                    <Leaf className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <h3 className="font-headline font-semibold text-xl mb-2">Local & National Focus</h3>
                            <p className="text-muted-foreground">
                                We are 100% focused on Kenya. This allows us to ensure quality and build strong relationships with our hosts, offering you a curated selection of the best local stays.
                            </p>
                        </div>
                        <div className="text-center p-6 bg-card border rounded-lg">
                            <div className="flex justify-center mb-4">
                                <div className="bg-secondary p-4 rounded-full">
                                    <ShieldCheck className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <h3 className="font-headline font-semibold text-xl mb-2">Verified Listings</h3>
                            <p className="text-muted-foreground">
                                Every listing on our platform undergoes a verification process by our team. We ensure that what you see is what you get, giving you peace of mind when you book.
                            </p>
                        </div>
                        <div className="text-center p-6 bg-card border rounded-lg">
                            <div className="flex justify-center mb-4">
                                <div className="bg-secondary p-4 rounded-full">
                                    <Heart className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <h3 className="font-headline font-semibold text-xl mb-2">Supporting Communities</h3>
                            <p className="text-muted-foreground">
                                By booking with StaysKenya, you are directly supporting local entrepreneurs and contributing to the Kenyan economy. We believe in travel that benefits everyone.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
