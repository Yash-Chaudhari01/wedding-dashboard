"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { Navigation, Search } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }: { position: L.LatLng, setPosition: any }) {
  const map = useMap();
  
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  // Automatically center the map whenever the position changes programmatically
  React.useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom() || 14);
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function AdminLocationPicker({ initialLat, initialLng }: { initialLat: number, initialLng: number }) {
  const [position, setPosition] = useState<L.LatLng>(new L.LatLng(initialLat, initialLng));
  const [locating, setLocating] = useState(false);
  const [addressSearch, setAddressSearch] = useState("");

  const handleGetCurrentLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition(new L.LatLng(pos.coords.latitude, pos.coords.longitude));
        setLocating(false);
      },
      (err) => {
        alert("Unable to retrieve your location. Please check your browser permissions.");
        setLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleGeocode = async () => {
    if (!addressSearch.trim()) return;
    setLocating(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressSearch)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setPosition(new L.LatLng(parseFloat(data[0].lat), parseFloat(data[0].lon)));
      } else {
        alert("Location not found visually. Try a different address phrase.");
      }
    } catch (e) {
      alert("Failed to find location. Please try manually clicking on the map.");
    } finally {
      setLocating(false);
    }
  };

  return (
    <div className="space-y-4">
       <div className="grid grid-cols-2 gap-4 hidden">
          <input type="number" step="any" name="venue_latitude" value={position.lat} readOnly />
          <input type="number" step="any" name="venue_longitude" value={position.lng} readOnly />
       </div>

       <div className="flex flex-col sm:flex-row gap-3">
         <button 
           type="button"
           onClick={handleGetCurrentLocation}
           disabled={locating}
           className="flex-1 bg-primary text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center hover:bg-primary-dark transition disabled:opacity-50 shadow-sm"
         >
           <Navigation className="w-4 h-4 mr-2" />
           {locating ? "Locating..." : "Auto-detect my GPS"}
         </button>

         <div className="flex-1 flex gap-2">
           <input 
             type="text"
             placeholder="Or type city/address..."
             value={addressSearch}
             onChange={(e) => setAddressSearch(e.target.value)}
             className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-primary text-sm"
             onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleGeocode(); } }}
           />
           <button 
             type="button"
             onClick={handleGeocode}
             disabled={locating || !addressSearch.trim()}
             className="bg-secondary text-primary-dark p-3 rounded-xl hover:bg-primary-light transition disabled:opacity-50"
           >
             <Search className="w-5 h-5" />
           </button>
         </div>
       </div>

       <div className="w-full h-[350px] rounded-2xl overflow-hidden shadow-sm border-2 border-primary-light z-0 relative">
         <MapContainer center={position} zoom={14} style={{ width: "100%", height: "100%" }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            <LocationMarker position={position} setPosition={setPosition} />
         </MapContainer>
       </div>
       <p className="text-sm font-medium text-primary-dark">👆 The map has been automatically centered. You can also click to fine-tune it.</p>
    </div>
  );
}
