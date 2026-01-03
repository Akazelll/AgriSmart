"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const myCustomColor = "#3A6F43"; 

const customIcon = new L.DivIcon({
  className: "custom-paddy-marker",
  iconSize: [34, 46],
  iconAnchor: [17, 46],
  popupAnchor: [0, -40],

  html: `
    <div style="position: relative; width: 100%; height: 100%; display: flex; justify-content: center;">
      
      <svg class="custom-pin-svg" width="34" height="46" viewBox="0 0 34 46" 
           style="position: absolute; z-index: 1; overflow: visible;">
        <path d="M17 0C7.611 0 0 7.611 0 17c0 14.5 17 29 17 29s17-14.5 17-29c0-9.389-7.611-17-17-17z" 
              fill="${myCustomColor}" stroke="white" stroke-width="1.5"/>
      </svg>
      
      <div style="position: absolute; top: 4px; z-index: 2; 
                  width: 26px; height: 26px; 
                  background: white; border-radius: 50%; 
                  display: flex; justify-content: center; align-items: center;
                  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);"> 
        
        <img src="img/padi%202.png" alt="Logo Padi" 
             style="width: 18px; height: 18px; object-fit: contain;">
             
      </div>
    </div>
  `,
});

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

      <Marker position={position} icon={customIcon}>
        <Popup>
          Lokasi: <br /> <b>{locationName}</b>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
