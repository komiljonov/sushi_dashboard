"use client";

import { ITaxi } from "@/lib/types";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};

const TaxiLocation = ({ taxi }: { taxi: ITaxi }) => {
  const start = {
    lat: taxi?.source_lat || 41.3111,
    lng: taxi?.source_lon || 69.2401,
  };
  const end = {
    lat: taxi?.destination_lat || 41.285,
    lng: taxi?.destination_lon || 69.2605,
  };

  const path = [start, end];

  const center = start;

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        <Marker position={start} />
        <Marker
          position={end}
          icon={{
            url: "/building.svg", // public folder path
            scaledSize: new google.maps.Size(40, 40), // control icon size
          }}
        />
        <Polyline
          path={path}
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
