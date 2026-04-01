import { useEffect, useState } from "react";

export interface BrowserLocation {
  latitude: number;
  longitude: number;
}

export function useGeolocation() {
  const [location, setLocation] = useState<BrowserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const locationOptions = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 60000,
  } as const;

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (geoError) => {
        setError(geoError.message || "Unable to retrieve your location.");
        setIsLoading(false);
      },
      locationOptions,
    );
  };

  useEffect(() => {
    requestLocation();

    if (!navigator.geolocation) {
      return undefined;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
        setIsLoading(false);
      },
      (geoError) => {
        setError(geoError.message || "Unable to retrieve your location.");
        setIsLoading(false);
      },
      locationOptions,
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return {
    location,
    error,
    isLoading,
    requestLocation,
  };
}
