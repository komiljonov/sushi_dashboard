"use client";

import { fetchTaxiLocations } from "@/lib/mutators";
import { ILocation, IOrder, ITaxi } from "@/lib/types";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};


const TaxiLocation = ({order}: {order: IOrder}) => {
  const [mapsApi, setMapsApi] = useState<google.maps.Map | null>(null);

  const taxi = order?.taxi as ITaxi

  const {data: location} = useQuery<ILocation>({
    queryKey: ["location"],
    queryFn: ()=> fetchTaxiLocations(order?.order_id || ""),
    refetchInterval: 5000,
    enabled: order?.status !== "DONE",
  })

  const courier = {
    lat: location?.latitude  ?? 0,
    lng: location?.longitude  ?? 0
  }

    const start = {
        lat:  taxi?.source_lat,
        lng:  taxi?.source_lon,
    };
    const end = {
        lat: taxi?.destination_lat,
        lng: taxi?.destination_lon,
    };
    const center = location?.latitude ? courier : (start || end)

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
              position={end}
            />
            <Marker
              position={start}
              icon={{
                url: "/building.svg",
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
            {location?.latitude && <Marker
              position={courier}
              icon={{
                url: "/courier.png",
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />}
          </>
        )}

        {order?.status === "DONE" && <Polyline
          path={[start, end]}
          options={{
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />}
      </GoogleMap>
    </LoadScript>
  );
};

export default TaxiLocation;
