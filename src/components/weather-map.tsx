"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

function ChangeView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.setView(coords, 13);
    }
  }, [coords, map]);
  return null;
}

interface WeatherMapProps {
  lat: number;
  lon: number;
  locationName: string;
}

export default function WeatherMap({
  lat,
  lon,
  locationName,
}: WeatherMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const position: [number, number] = [lat, lon];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className='h-full w-full rounded-2xl bg-stone-200/50 dark:bg-stone-800/50 animate-pulse flex items-center justify-center text-stone-400'>
        Memuat Peta...
      </div>
    );
  }

  return (
    <MapContainer
      key={`${lat}-${lon}`}
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      className='h-full w-full rounded-2xl z-0'
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <ChangeView coords={position} />
      <Marker position={position}>
        <Popup>
          Lokasi: <br /> <b>{locationName}</b>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
