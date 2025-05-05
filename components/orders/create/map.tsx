"use client";

import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { useFormContext, Controller } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { CreateOrderForm } from "./types";
import { MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import SelectLocations from "./select-locations";
import { Input } from "@/components/ui/Input";

const DEFAULT_CENTER: [number, number] = [41.311081, 69.240562];

export default function DeliveryMap() {
  const { control, setValue, watch } = useFormContext<CreateOrderForm>();
  const lat = watch("location.latitude") ?? DEFAULT_CENTER[0];
  const lng = watch("location.longitude") ?? DEFAULT_CENTER[1];

  const [selectedLocation, setSelectedLocation] = useState<[number, number]>([
    lat,
    lng,
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    { display_name: string; lat: string; lon: string }[]
  >([]);

  const mapRef = useRef<ymaps.Map | null>(null); // 👈 store map instance

  useEffect(() => {
    setSelectedLocation([lat, lng]);
  }, [lat, lng]);

  // ✅ Animate map pan when selectedLocation changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo(selectedLocation, { delay: 300 });
    }
  }, [selectedLocation]);

  const { data: selectedAddress } = useQuery({
    queryKey: ["reverse-osm", selectedLocation],
    queryFn: async () => {
      const [lat, lng] = selectedLocation;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      return data.display_name || "";
    },
    enabled: !!selectedLocation,
  });

  const updateLocation = (coords: [number, number]) => {
    setSelectedLocation(coords);
    setValue("location.latitude", coords[0]);
    setValue("location.longitude", coords[1]);
  };

  const handleMapClick = (e: ymaps.MapEvent) => {
    const coords = e.get("coords") as [number, number];
    updateLocation(coords);
  };

  const handleDragEnd = (event: ymaps.IEvent<undefined, ymaps.Placemark>) => {
    const coords = event.get("target").geometry?.getCoordinates() as [
      number,
      number
    ];
    if (coords) updateLocation(coords);
  };

  const debouncedFetchSuggestions = debounce(async (query: string) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          new URLSearchParams({
            q: query,
            format: 'json',
            addressdetails: '1',
            limit: '5',
            viewbox: '55.98,45.59,73.15,37.18', // Uzbekistan bbox
            bounded: '1',
          })
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("OSM suggestion error:", err);
    }
  }, 400); // 🔁 Updated to 400ms
  
  

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.length >= 3) {
        debouncedFetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 400);
  
    return () => clearTimeout(delayDebounce); // cleanup on new keystroke
  }, [searchQuery, debouncedFetchSuggestions]);
  

  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
  };
  

  const handleSuggestionClick = (place: {
    display_name: string;
    lat: string;
    lon: string;
  }) => {
    setSearchQuery(place.display_name);
    updateLocation([parseFloat(place.lat), parseFloat(place.lon)]);
    setTimeout(() => setSuggestions([]), 100);
  };

  return (
    <YMaps query={{ lang: "ru_RU" }}>
      <div className="w-full space-y-3">
        {/* 🔍 Search Input */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-3">
            <Input
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Qidirish..."
              className="w-full p-2 border rounded-md input"
              autoComplete="off"
            />
            <SelectLocations />
          </div>

          {/* 📍 Suggestions */}
          {suggestions.length > 0 && (
            <ul className="absolute z-50 bg-white border rounded w-full shadow max-h-40 overflow-y-auto">
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionClick(s);
                  }}
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🗺 Map Display */}
        <Controller
          name="location.latitude"
          control={control}
          render={() => (
            <Controller
              name="location.longitude"
              control={control}
              render={() => (
                <div className="h-[400px] w-full">
                  <Map
                    defaultState={{ center: DEFAULT_CENTER, zoom: 14 }}
                    className="w-full h-full"
                    instanceRef={(ref) => {
                      if (ref && !mapRef.current) {
                        mapRef.current = ref;
                      }
                    }}
                    onClick={handleMapClick}
                  >
                    <Placemark
                      geometry={selectedLocation}
                      options={{ draggable: true }}
                      onDragEnd={handleDragEnd}
                    />
                  </Map>
                </div>
              )}
            />
          )}
        />

        {/* 📌 Address Display */}
        {selectedAddress && (
          <div className="mt-3 text-sm flex items-center gap-2 p-4 rounded-lg border bg-[#FAFAFA]">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <span className="text-gray-700">{selectedAddress}</span>
          </div>
        )}
      </div>
    </YMaps>
  );
}
