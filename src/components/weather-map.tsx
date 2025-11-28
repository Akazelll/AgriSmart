// src/components/weather-map.tsx
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- 1. SETUP ICON SECARA STATIS ---
// Mendefinisikan icon di luar komponen agar tidak dibuat ulang setiap render
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// --- 2. KOMPONEN PENGENDALI VIEW ---
// Ini yang bertugas "menggeser" peta saat lat/lon berubah
function ChangeView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (map) {
      // Gunakan flyTo untuk animasi halus, atau setView untuk instan
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
      // PENTING: Hapus properti 'key' dan 'id' di sini.
      // Biarkan MapContainer merender sekali saja.
      // Perubahan lokasi akan ditangani oleh komponen <ChangeView /> dan <Marker />.
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      className='h-full w-full rounded-2xl z-0'
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {/* Update posisi kamera */}
      <ChangeView coords={position} />

      {/* Update posisi marker */}
      <Marker position={position} icon={customIcon}>
        <Popup>
          Lokasi: <br /> <b>{locationName}</b>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
