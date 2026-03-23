"use client";

import { useActionState, useState, useEffect } from "react";
import { updateWeddingInfo } from "@/app/admin/actions";
import { QRCodeSVG } from "qrcode.react";
import AdminLocationPicker from "./AdminLocationPickerWrapper";

export default function DashboardForm({ wedding, visitsCount }: { wedding: any, visitsCount: number }) {
  const [state, formAction, pending] = useActionState(updateWeddingInfo, null);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.origin);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-primary-light">
        <h2 className="text-2xl font-heading text-primary-dark mb-6">Edit Wedding Details</h2>
        
        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bride's Name</label>
              <input type="text" name="bride_name" defaultValue={wedding.bride_name} className="w-full border rounded-lg px-4 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Groom's Name</label>
              <input type="text" name="groom_name" defaultValue={wedding.groom_name} className="w-full border rounded-lg px-4 py-2" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Wedding Date & Time</label>
            <input type="datetime-local" name="wedding_date" defaultValue={new Date(wedding.wedding_date).toISOString().slice(0, 16)} className="w-full border rounded-lg px-4 py-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Venue Name</label>
            <input type="text" name="venue_name" defaultValue={wedding.venue_name} className="w-full border rounded-lg px-4 py-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Venue Address</label>
            <textarea name="venue_address" defaultValue={wedding.venue_address} rows={3} className="w-full border rounded-lg px-4 py-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Set Exact Location Coordinates (Map)</label>
            <AdminLocationPicker initialLat={wedding.venue_latitude} initialLng={wedding.venue_longitude} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nearby Landmarks</label>
            <input type="text" name="landmarks" defaultValue={wedding.landmarks || ""} className="w-full border rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Parking Information</label>
            <textarea name="parking_info" defaultValue={wedding.parking_info || ""} rows={2} className="w-full border rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Numbers</label>
            <input type="text" name="contact_numbers" defaultValue={wedding.contact_numbers} className="w-full border rounded-lg px-4 py-2" required />
          </div>
          
          {state?.error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{state.error}</p>}
          {state?.message && <p className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">{state.message}</p>}

          <button disabled={pending} type="submit" className="w-full bg-primary text-white rounded-xl py-3 font-medium hover:bg-primary-dark transition disabled:opacity-50">
            {pending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-primary-light flex flex-col items-center">
          <h2 className="text-xl font-heading text-primary-dark mb-6">Invitation QR Code</h2>
          <div className="bg-white p-4 rounded-xl shadow-md border hover:scale-105 transition-transform">
            {currentUrl && (
              <QRCodeSVG value={`${currentUrl}/`} size={200} level="H" includeMargin />
            )}
          </div>
          <p className="text-sm text-center text-foreground/70 mt-4 leading-relaxed">
            Scan this QR code with any smartphone to open the live wedding navigation page. 
            Download and place this on your invitation cards!
          </p>
          <div className="mt-6 w-full bg-secondary/50 p-4 rounded-xl text-center border border-primary-light">
            <h3 className="text-sm uppercase tracking-wider text-accent font-medium mb-1">Total Guest Page Views</h3>
            <p className="text-3xl font-heading text-primary-dark font-semibold animate-pulse">{visitsCount ?? 0}</p>
          </div>
          <button 
            onClick={() => window.print()}
            className="mt-6 px-6 py-2 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition"
          >
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}
