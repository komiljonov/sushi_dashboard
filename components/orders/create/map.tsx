"use client";

import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { useFormContext } from "react-hook-form";
import { useEffect, useState, useRef, useMemo } from "react";
import { CreateOrderForm } from "./types";
import { MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import SelectLocations from "./select-locations";
import { Input } from "@/components/ui/Input";

const DEFAULT_CENTER: [number, number] = [41.311081, 69.240562];

export default function DeliveryMap({
  taxi,
  required = false,
}: {
  taxi?: boolean;
  required?: boolean;
}) {
  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext<CreateOrderForm>();

  const lat = watch("location.latitude");
  const lng = watch("location.longitude");

  const [selectedLocation, setSelectedLocation] = useState<[number, number]>([
    lat ?? DEFAULT_CENTER[0],
    lng ?? DEFAULT_CENTER[1],
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    { display_name: string; lat: string; lon: string }[]
  >([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);

  const mapRef = useRef<ymaps.Map | null>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const isManualUpdateRef = useRef(false);

  useEffect(() => {
    if (lat && lng) {
      setSelectedLocation([lat, lng]);
    }
  }, [lat, lng]);

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

  useEffect(() => {
    if (isManualUpdateRef.current && selectedAddress) {
      setSearchQuery(selectedAddress);
      setIsDropdownOpen(false);
      setIsUserTyping(false);
      isManualUpdateRef.current = false;
    }
  }, [selectedAddress]);

  const updateLocation = (coords: [number, number], fromMap = false) => {
    setSelectedLocation(coords);
    setValue("location.latitude", coords[0], { shouldValidate: true });
    setValue("location.longitude", coords[1], { shouldValidate: true });
    if (fromMap) {
      isManualUpdateRef.current = true;
    }
  };

  const handleMapClick = (e: ymaps.MapEvent) => {
    const coords = e.get("coords") as [number, number];
    updateLocation(coords, true);
  };

  const handleDragEnd = (event: ymaps.IEvent<undefined, ymaps.Placemark>) => {
    const coords = event.get("target").geometry?.getCoordinates() as [
      number,
      number
    ];
    if (coords) updateLocation(coords, true);
  };

  const debouncedFetchSuggestions = useMemo(
    () =>
      debounce(async (query: string) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
              new URLSearchParams({
                q: query,
                format: "json",
                addressdetails: "1",
                limit: "5",
                viewbox: "55.98,45.59,73.15,37.18",
                bounded: "1",
              })
          );
          const data = await res.json();
          setSuggestions(data);
          setIsDropdownOpen(true);
        } catch (err) {
          console.error("OSM suggestion error:", err);
        }
      }, 500),
    []
  );

  useEffect(() => {
    if (!isUserTyping) return;
    if (searchQuery.length >= 3) {
      debouncedFetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  }, [searchQuery, debouncedFetchSuggestions, isUserTyping]);

  useEffect(() => {
    return () => debouncedFetchSuggestions.cancel();
  }, [debouncedFetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    setIsUserTyping(true);
  };

  const handleSuggestionClick = (place: {
    display_name: string;
    lat: string;
    lon: string;
  }) => {
    setSearchQuery(place.display_name);
    updateLocation([parseFloat(place.lat), parseFloat(place.lon)]);
    setIsDropdownOpen(false);
    setSuggestions([]);
    setIsUserTyping(false);
  };

  return (
    <YMaps query={{ lang: "ru_RU" }}>
      <div className="w-full space-y-3">
        {/* hidden required inputs for validation */}
        {required && (
          <>
            <input
              type="hidden"
              {...register("location.latitude", { required: "Manzilni tanlang" })}
            />
            <input
              type="hidden"
              {...register("location.longitude", { required: "Manzilni tanlang" })}
            />
          </>
        )}

        <div ref={inputWrapperRef} className="relative">
          <div className="grid grid-cols-2 gap-3">
            <Input
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Qidirish..."
              className={`${taxi ? "col-span-2" : "col-span-1"} w-full p-2 border rounded-md input ${
                (errors.location?.latitude || errors.location?.longitude) ? "border-red-500" : ""
              }`}
              autoComplete="off"
            />
            {!taxi && <SelectLocations />}
          </div>

          {isDropdownOpen && suggestions.length > 0 && (
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

          {/* 🛑 Error Message */}
          {(errors.location?.latitude || errors.location?.longitude) && (
            <p className="text-red-500 text-sm mt-1">Manzilni tanlang</p>
          )}
        </div>

        {/* 🗺 Map */}
        <div className={`${taxi ? "h-[300px]" : "h-[400px]"} w-full`}>
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

        {/* 📍 Display Address */}
        {selectedAddress && !taxi && (
          <div className="mt-3 text-sm flex items-center gap-2 p-4 rounded-lg border bg-[#FAFAFA]">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <span className="text-gray-700">{selectedAddress}</span>
          </div>
        )}
      </div>
    </YMaps>
  );
}
