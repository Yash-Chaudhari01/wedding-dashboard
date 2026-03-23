"use client";

import dynamic from "next/dynamic";

const AdminLocationPicker = dynamic(() => import("./AdminLocationPicker"), { 
  ssr: false, 
  loading: () => <div className="h-[350px] w-full bg-secondary/30 animate-pulse rounded-2xl border-2 border-primary-light flex items-center justify-center text-primary-dark">Loading Location Map...</div> 
});

export default AdminLocationPicker;
