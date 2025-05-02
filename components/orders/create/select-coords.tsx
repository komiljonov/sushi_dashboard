'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { Marker, NavigationControl, MapRef } from 'react-map-gl';
import { useRef, useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaLocationArrow } from 'react-icons/fa';

const defaultCoords = { latitude: 41.2995, longitude: 69.2401 };

export default function MapSelector() {
  const mapRef = useRef<MapRef>(null);
  const { setValue } = useFormContext();
  const [marker, setMarker] = useState(defaultCoords);
  const [mounted, setMounted] = useState(false); // prevent SSR/DOM mismatch

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMoveMarker = (lng: number, lat: number) => {
    setMarker({ longitude: lng, latitude: lat });
    setValue('location.latitude', lat);
    setValue('location.longitude', lng);
  };

  const handleMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          longitude: pos.coords.longitude,
          latitude: pos.coords.latitude,
        };
        setMarker(coords);
        setValue('location.latitude', coords.latitude);
        setValue('location.longitude', coords.longitude);
        mapRef.current?.flyTo({ center: [coords.longitude, coords.latitude], zoom: 14 });
      },
      (err) => {
        alert('Could not get your location: ' + err.message);
      }
    );
  };

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded border">
      <button
        type="button"
        onClick={handleMyLocation}
        className="absolute right-2 bottom-2 z-10 p-2 bg-white border rounded-full shadow"
      >
        <FaLocationArrow />
      </button>

      {mounted && (
        <Map
          ref={mapRef}
          initialViewState={{ ...marker, zoom: 13 }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="https://api.maptiler.com/maps/streets/style.json?key=BGXt4rJdnoeNTKQjsqX1"
          onClick={(e) => {
            const { lng, lat } = e.lngLat;
            handleMoveMarker(lng, lat);
          }}
        >
          <Marker
            longitude={marker.longitude}
            latitude={marker.latitude}
            draggable
            onDragEnd={(e) => {
              const { lng, lat } = e.lngLat;
              handleMoveMarker(lng, lat);
            }}
          />
          <NavigationControl position="top-left" />
        </Map>
      )}
    </div>
  );
}
