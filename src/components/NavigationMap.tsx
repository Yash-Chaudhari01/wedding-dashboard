"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import confetti from "canvas-confetti";
import { LocateFixed } from "lucide-react";

delete (L.Icon.Default.prototype as any)._getIconUrl;

const venueIcon = L.divIcon({ 
  className: "bg-transparent", 
  html: "<div class='flex items-center justify-center w-14 h-14 bg-[#0A0A0A]/80 backdrop-blur-md border border-[#CBAEAE] rounded-full shadow-[0_0_30px_rgba(203,174,174,0.6)] transform hover:scale-110 transition-transform'><svg width='24' height='24' viewBox='0 0 24 24' fill='#CBAEAE' stroke='#CBAEAE' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'><path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'></path></svg></div>", 
  iconSize: [56, 56], 
  iconAnchor: [28, 28] 
});

const liveUserIcon = L.divIcon({ 
  className: "bg-transparent", 
  html: "<div style='display:flex;align-items:center;justify-content:center;width:24px;height:24px;'><div style='background-color:#E6D4B8;width:12px;height:12px;border-radius:50%;box-shadow:0 0 20px #E6D4B8;position:relative;'><div style='position:absolute;top:-10px;left:-10px;right:-10px;bottom:-10px;border:1px solid rgba(230,212,184,0.6);border-radius:50%;animation:ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;'></div></div></div>", 
  iconSize: [24, 24], 
  iconAnchor: [12, 12] 
});

function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; 
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

function Routing({ userLat, userLng, venueLat, venueLng }: { userLat: number, userLng: number, venueLat: number, venueLng: number }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(userLat, userLng), L.latLng(venueLat, venueLng)],
      show: false, // Absolutely essential: Hides standard robotic UI
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null as any,
      lineOptions: {
        styles: [{ color: '#E6D4B8', weight: 4, opacity: 0.6, dashArray: '1, 10' }],
        extendToWaypoints: false,
        missingRouteTolerance: 0
      }
    } as any).addTo(map);

    return () => { 
      try { 
        if (routingControl) {
          routingControl.getPlan().setWaypoints([]);
          map.removeControl(routingControl); 
        }
      } catch (e) {} 
    };
  }, [map, userLat, userLng, venueLat, venueLng]);
  return null;
}

function LiveTracker({ liveLocation, isTracking, setIsTracking }: { liveLocation: [number, number] | null, isTracking: boolean, setIsTracking: (v: boolean) => void }) {
  const map = useMapEvents({ dragstart() { setIsTracking(false); } });
  useEffect(() => {
    if (liveLocation && isTracking) {
      map.flyTo(liveLocation, 15, { animate: true, duration: 2.5, easeLinearity: 0.1 });
    }
  }, [liveLocation, isTracking, map]);
  return liveLocation ? <Marker position={liveLocation} icon={liveUserIcon} zIndexOffset={1000} /> : null;
}

export default function NavigationMap({ venueLat, venueLng, venueName }: any) {
  const [initialUserLocation, setInitialUserLocation] = useState<[number, number] | null>(null);
  const [liveLocation, setLiveLocation] = useState<[number, number] | null>(null);
  const [isTracking, setIsTracking] = useState(true);
  const watchIdRef = useRef<number | null>(null);
  const [distanceInfo, setDistanceInfo] = useState("Let's get you to the celebration ❤️");
  const [etaInfo, setEtaInfo] = useState("");
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
       watchIdRef.current = navigator.geolocation.watchPosition(
         pos => {
            const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
            setLiveLocation(loc);
            setInitialUserLocation((prev) => prev || loc);
         },
         () => { setDistanceInfo("Please enable location to experience the journey directly."); },
         { enableHighAccuracy: true }
       );
    }
    return () => { if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); };
  }, []);

  useEffect(() => {
    if (liveLocation) {
      const dist = getDistanceInMeters(liveLocation[0], liveLocation[1], venueLat, venueLng);
      // Constructing emotional journey guidance
      if (dist < 100) {
        setDistanceInfo("You have arrived. Let the celebration begin ❤️");
        setEtaInfo("");
        if (!arrived) {
          setArrived(true);
          const duration = 3 * 1000;
          const animationEnd = Date.now() + duration;
          const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
          const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ particleCount, origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }, colors: ['#D4AF37', '#E6D4B8', '#CBAEAE'] });
          }, 250);
        }
      } else if (dist < 1000) {
        setDistanceInfo("Almost there... love is in the air ✨");
        setEtaInfo(`Just ${Math.round(dist)} meters away`);
      } else if (dist < 5000) {
        setDistanceInfo("You're getting closer to the unforgettable moments.");
        setEtaInfo(`${(dist / 1000).toFixed(1)} km away`);
      } else {
        setDistanceInfo("Safe travels. We can't wait to see you ❤️");
        setEtaInfo(`${(dist / 1000).toFixed(1)} km away`);
      }
    }
  }, [liveLocation, venueLat, venueLng, arrived]);

  return (
    <div className="w-full h-full relative bg-[#0A0A0A]">
      {/* Immersive Dark Vignette Overlays */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#0A0A0A] to-transparent z-[1000] pointer-events-none opacity-90" />
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#0A0A0A] to-transparent z-[1000] pointer-events-none opacity-90" />

      {/* Human Guidance Layer */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-[1001] w-[90%] max-w-lg flex flex-col items-center text-center">
        <p className="text-[#F9F6F0] font-heading text-xl md:text-3xl drop-shadow-lg leading-relaxed mb-2">{distanceInfo}</p>
        {etaInfo && <p className="text-[#CBAEAE] font-sans tracking-[0.3em] uppercase text-xs font-semibold bg-white/5 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">{etaInfo}</p>}
      </div>

      {liveLocation && !isTracking && (
        <button 
          onClick={() => setIsTracking(true)} 
          className="absolute bottom-16 right-8 z-[1001] text-[#0A0A0A] bg-[#E6D4B8] p-4 rounded-full shadow-[0_0_20px_rgba(230,212,184,0.4)] hover:bg-white transition-all transform hover:scale-110 flex items-center justify-center font-medium gap-2"
        >
          <LocateFixed className="w-5 h-5" />
        </button>
      )}

      {/* Luxury CartoDB Dark Matter Base */}
      <MapContainer center={[venueLat, venueLng]} zoom={13} style={{ width: "100%", height: "100%" }} zoomControl={false}>
         <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
         <Marker position={[venueLat, venueLng]} icon={venueIcon} />
         {initialUserLocation && <Routing userLat={initialUserLocation[0]} userLng={initialUserLocation[1]} venueLat={venueLat} venueLng={venueLng} />}
         <LiveTracker liveLocation={liveLocation} isTracking={isTracking} setIsTracking={setIsTracking} />
      </MapContainer>
    </div>
  );
}
