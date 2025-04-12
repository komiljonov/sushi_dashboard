"use client";

import { ITaxi } from "@/lib/types";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};


const TaxiLocation = ({taxi}: {taxi: ITaxi}) => {
  const [mapsApi, setMapsApi] = useState<google.maps.Map | null>(null);

    const start = {
        lat: taxi?.source_lat,
        lng: taxi?.source_lon,
    };
    const end = {
        lat: taxi?.destination_lat,
        lng: taxi?.destination_lon,
    };
    const center = start || end

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={(map) => {
          setMapsApi(map);
        }}
      >
        {/* Only render custom markers after the map (and google object) is ready */}
        {mapsApi && (
          <>
            <Marker
              position={start}
            />
            <Marker
              position={end}
              icon={{
                url: "/building.svg",
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          </>
        )}

        <Polyline
          path={[start, end]}
          options={{
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default TaxiLocation;
