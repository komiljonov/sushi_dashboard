"use client";

import { GoogleMap, LoadScript, HeatmapLayer } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 41.3111, // Centered in Tashkent
  lng: 69.2797,
};

const coords = [
    {lat: 41.3111, long: 69.2797, radius: 1},
{lat: 39.6545, long: 66.9759, radius: 3},
{lat: 40.1033, long: 65.3683, radius: 5},
{lat: 37.5731, long: 67.0000, radius: 30},
{lat: 40.7860, long: 72.3119, radius: 35},
{lat: 41.5500, long: 60.6333, radius: 20},
{lat: 38.8367, long: 65.7931, radius: 45},
{lat: 40.3777, long: 71.7889, radius: 10},
{lat: 40.1221, long: 67.8280, radius: 20},
{lat: 39.7750, long: 64.4250, radius: 50},
]

const Heatmap = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [heatMapData, setHeatMapData] = useState<google.maps.LatLng[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      setHeatMapData(
        coords.map((coord) => new google.maps.LatLng(coord.lat, coord.long))
      );
    }
  }, []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyDWszbdg491237CN57Xk4bE4E50Ve-Wk00" libraries={["visualization"]}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={6} onLoad={setMap}>
        {map && heatMapData.length > 0 && (
          <HeatmapLayer
            data={heatMapData}
            options={{
              radius: 30,
              opacity: 0.7,
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Heatmap;
