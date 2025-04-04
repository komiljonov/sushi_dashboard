import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import { useMemo, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CreateOrderForm } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/Input";

// Location Picker Component
const LocationPicker = ({
  location,
}: {
  location: { loc_latitude: number; loc_longitude: number };
}) => {
  const position = { lat: location.loc_latitude, lng: location.loc_longitude };
  return <Marker position={position} />;
};

// Delivery Map Component
export default function DeliveryMap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const { control, setValue } = useFormContext<CreateOrderForm>();
  const [mapCenter, setMapCenter] = useState({ lat: 41.2995, lng: 69.2401 });

  const bounds = useMemo(
    () => ({
      north: 45.0,
      south: 37.0,
      east: 72.0,
      west: 55.0,
    }),
    []
  );

  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onPlaceSelect = () => {
    if (autoCompleteRef.current) {
      const place = autoCompleteRef.current.getPlace();
      if (place.geometry) {
        setValue("location.longitude", place.geometry.location?.lng() || 0);
        setValue("location.latitude", place.geometry.location?.lat() || 0);
        setMapCenter({
          lat: place.geometry.location?.lat() || 0,
          lng: place.geometry.location?.lng() || 0,
        });
      }
    }
  };

  // const mapStyles = [
  // {
  //     featureType: "poi.business",
  //     stylers: [{ visibility: "off" }]
  // },
  // {
  //     featureType: "poi",
  //     stylers: [{ visibility: "off" }]
  // }
  // ];

  return (
    <div className="h-80 bg-gray-100 flex flex-col items-center justify-center rounded-md">
      {isLoaded ? (
        <>
          <div className="relative w-full mb-1">
            {/* Search Box */}
            <Autocomplete
              onLoad={(autocomplete) =>
                (autoCompleteRef.current = autocomplete)
              }
              onPlaceChanged={onPlaceSelect}
            >
              <Input placeholder="Qidirish..." className="w-full bg-white" />
            </Autocomplete>
          </div>
          {/* <p className="text-sm text-gray-700 mb-2">
            Xaritani bosish orqali joylashuvni belgilang
          </p> */}
          <Controller
            name="location.latitude"
            control={control}
            render={({ field: latitude }) => (
              <Controller
                name="location.longitude"
                control={control}
                render={({ field: longitude }) => (
                  <GoogleMap
                    center={mapCenter}
                    zoom={13}
                    onClick={(e: google.maps.MapMouseEvent) => {
                      latitude.onChange(e.latLng?.lat());
                      longitude.onChange(e.latLng?.lng());
                    }}
                    mapContainerStyle={{ height: "100%", width: "100%" }}
                    options={{
                      restriction: {
                        latLngBounds: bounds,
                        strictBounds: true,
                      },
                      // styles: mapStyles,
                    }}
                  >
                    <LocationPicker
                      location={{
                        loc_longitude: longitude.value,
                        loc_latitude: latitude.value,
                      }}
                    />
                  </GoogleMap>
                )}
              />
            )}
          />
          <p className="text-xs text-gray-500 mt-2">
            Yetkazib berish joyini tanlash uchun xaritani bosing
          </p>
        </>
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </div>
  );
}
