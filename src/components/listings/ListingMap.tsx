'use client';

import React from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { MapPin } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
};

interface ListingMapProps {
  lat: number;
  lng: number;
}

export default function ListingMap({ lat, lng }: ListingMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script-display',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const center = { lat, lng };

  const handleGetDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  if (loadError) {
    return <div>Error loading map.</div>;
  }
  
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Google Maps Not Configured</AlertTitle>
            <AlertDescription>
            The Google Maps API key is missing, so the location map cannot be displayed.
            </AlertDescription>
        </Alert>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-lg bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
            }}
        >
            <MarkerF position={center} />
        </GoogleMap>
        <Button onClick={handleGetDirections} className="mt-4">
            <MapPin className="mr-2 h-4 w-4" />
            Get Directions
        </Button>
    </div>
  );
}
