
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Check, Gift } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface PricingCardProps {
    plan: string;
    price: number;
    features: string[];
    isPopular?: boolean;
    isFreeOfferAvailable?: boolean;
    activeHostCount?: number;
}

export function PricingCard({ plan, price, features, isPopular, isFreeOfferAvailable, activeHostCount }: PricingCardProps) {
    return (
        <Card className={cn("flex flex-col", isPopular && "border-primary border-2 shadow-lg")}>
            {isPopular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
            <CardHeader>
                <CardTitle className="font-headline text-3xl">{plan}</CardTitle>
                <CardDescription>A plan for hosts getting started.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                 {isFreeOfferAvailable && plan === "Standard" && activeHostCount !== undefined ? (
                    <div className="mb-6">
                        <p className="text-5xl font-bold">KES 0</p>
                        <p className="text-lg text-muted-foreground line-through">KES {price.toLocaleString()}</p>
                        <Alert className="mt-4 bg-green-50 border-green-200 text-green-800">
                            <Gift className="h-5 w-5 text-green-600" />
                            <AlertTitle className="font-bold">First Year Free!</AlertTitle>
                            <AlertDescription>
                                For being one of our first {5} hosts.
                            </AlertDescription>
                        </Alert>
                    </div>
                ) : (
                    <p className="text-5xl font-bold mb-6">KES {price.toLocaleString()} <span className="text-lg font-normal text-muted-foreground">/ year</span></p>
                )}


                <ul className="space-y-4">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                            <Check className="h-5 w-5 text-primary mr-3" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                {/* The button is in the main form now */}
            </CardFooter>
        </Card>
    )
}
