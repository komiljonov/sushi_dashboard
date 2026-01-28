"use client";

import { GoogleMap, LoadScript } from "@react-google-maps/api";
import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrderLocations } from "@/lib/actions/stats.actions";

const mapContainerStyle = { width: "100%", height: "1000px" };
const center = { lat: 41.3111, lng: 69.2797 };

type Coord = { latitude: number; longitude: number };

export default function MapWithClusters() {
  const [radius, setRadius] = useState(80);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);

  const { data: coords } = useQuery<Coord[]>({
    queryKey: ["order-locations"],
    queryFn: fetchOrderLocations,
  });

  // Create markers once (when coords arrive)
  useEffect(() => {
    if (!coords || coords.length === 0) return;
    if (!(window).google) return;

    // clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = coords
      // .filter(
      //   (p) =>
      //     Number.isFinite(p.latitude) &&
      //     Number.isFinite(p.longitude) &&
      //     Math.abs(p.latitude) <= 90 &&
      //     Math.abs(p.longitude) <= 180
      // )
      .map(
        (p) =>
          new google.maps.Marker({
            position: { lat: p.latitude, lng: p.longitude },
          })
      );
  }, [coords]);

  const algorithm = useMemo(
    () =>
      new SuperClusterAlgorithm({
        radius,
        maxZoom: 17,
      }),
    [radius]
  );

  // (Re)build clusterer whenever radius changes (or map/markers ready)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!markersRef.current.length) return;

    clustererRef.current?.clearMarkers();

    clustererRef.current = new MarkerClusterer({
      map,
      markers: markersRef.current,
      algorithm,
    });
  }, [algorithm]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      clustererRef.current?.clearMarkers();
      markersRef.current.forEach((m) => m.setMap(null));
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* slider UI */}
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: 12,
          left: 12,
          background: "white",
          padding: 12,
          borderRadius: 10,
          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
          width: 260,
        }}
      >
        <div style={{ fontSize: 14, marginBottom: 8 }}>
          Cluster radius: <b>{radius}</b>
        </div>
        <input
          type="range"
          min={20}
          max={250}
          step={5}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      {coords && (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            onLoad={(map) => {
              mapRef.current = map;
            }}
          />
        </LoadScript>
      )}
    </div>
  );
}
