'use client';

import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Autocomplete, MarkerF } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormSetValue } from 'react-hook-form';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
};

// Default center to somewhere in Kenya
const defaultCenter = {
  lat: -0.0236,
  lng: 37.9062
};

interface LocationInputProps {
  setValue: UseFormSetValue<any>;
  initialCenter?: { lat: number, lng: number };
  initialAddress?: string;
}

const libraries: "places"[] = ["places"];

export default function LocationInput({ setValue, initialCenter, initialAddress }: LocationInputProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState(initialCenter || defaultCenter);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    if(initialCenter) {
      mapInstance.setCenter(initialCenter);
      mapInstance.setZoom(15);
    } else {
      mapInstance.setCenter(defaultCenter);
      mapInstance.setZoom(6);
    }
  }, [initialCenter]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onAutoCompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || "";

        map?.panTo({ lat, lng });
        map?.setZoom(15);
        setMarkerPosition({ lat, lng });

        setValue('location', address, { shouldValidate: true });
        setValue('lat', lat, { shouldValidate: true });
        setValue('lng', lng, { shouldValidate: true });
      }
    }
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Google Maps Not Configured</AlertTitle>
            <AlertDescription>
            The Google Maps API key is missing. Please add <code className="font-mono p-1 bg-background rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your .env file to enable location features.
            </AlertDescription>
        </Alert>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-lg bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading Map...</p>
      </div>
    );
  }

  return (
    <div>
        <Autocomplete
            onLoad={onAutoCompleteLoad}
            onPlaceChanged={onPlaceChanged}
        >
            <Input 
              type="text" 
              placeholder="Start typing your property's address..." 
              defaultValue={initialAddress}
              className="mb-4"
            />
        </Autocomplete>
      
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={markerPosition}
            zoom={initialCenter ? 15 : 6}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <MarkerF position={markerPosition} />
        </GoogleMap>
    </div>
  );
}
