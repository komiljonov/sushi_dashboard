"use client";

import { GoogleMap, LoadScript, InfoWindow } from "@react-google-maps/api";
import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrderLocations } from "@/lib/actions/stats.actions";

const mapContainerStyle = { width: "100%", height: "70vh" };
const center = { lat: 41.3111, lng: 69.2797 };

type Coord = {
  latitude: number;
  longitude: number;
  address: string;
  // xohlasang keyin qo‘shasan:
  // orderId?: string;
  // count?: number;
};

export default function MapWithClusters({
  from,
  to,
}: {
  from: string;
  to: string;
}) {
  const [radius, setRadius] = useState(80);
  const [mapsReady, setMapsReady] = useState(false);

  // ✅ selected marker details
  const [selected, setSelected] = useState<Coord | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);

  const { data: coords } = useQuery<Coord[]>({
    queryKey: ["order-locations", from, to],
    queryFn: () => fetchOrderLocations({ from, to }),
  });

  const algorithm = useMemo(
    () =>
      new SuperClusterAlgorithm({
        radius,
        maxZoom: 17,
      }),
    [radius],
  );

  useEffect(() => {
    if (!mapsReady) return;
    const map = mapRef.current;
    if (!map) return;
    if (!coords || coords.length === 0) return;

    // clear previous
    clustererRef.current?.clearMarkers();
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // build markers
    markersRef.current = coords.map((p) => {
      const marker = new google.maps.Marker({
        position: { lat: p.latitude, lng: p.longitude },
        title: p.address,
      });

      // ✅ click -> open details (InfoWindow + side panel)
      marker.addListener("click", () => {
        setSelected(p);
        map.panTo({ lat: p.latitude, lng: p.longitude });
      });

      return marker;
    });

    clustererRef.current = new MarkerClusterer({
      map,
      markers: markersRef.current,
      algorithm,
    });
  }, [mapsReady, coords, algorithm]);

  // cleanup
  useEffect(() => {
    return () => {
      clustererRef.current?.clearMarkers();
      markersRef.current.forEach((m) => m.setMap(null));
    };
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  return (
    <div style={{ position: "relative" }}>
      {/* radius slider */}
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

      <div style={mapContainerStyle} className="border rounded-2xl">
        <LoadScript googleMapsApiKey={apiKey} onLoad={() => setMapsReady(true)}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            onLoad={(map) => {
              mapRef.current = map;
            }}
            onClick={() => setSelected(null)} // map bosilsa yopilsin
          >
            {/* ✅ InfoWindow on selected */}
            {selected && (
              <InfoWindow
                position={{ lat: selected.latitude, lng: selected.longitude }}
                onCloseClick={() => setSelected(null)}
              >
                <div style={{ maxWidth: 220 }}>
                  <b>Buyurtma joylashuvi</b>
                  <div style={{ fontSize: 12, marginTop: 6 }}>
                    {selected.address}
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
