import { prisma } from "@/lib/prisma";
import { MoveLeft, MapPin, Car, Phone } from "lucide-react";
import Link from "next/link";
import NavigationMapWrapper from "@/components/NavigationMapWrapper";
import FloatingParticles from "@/components/FloatingParticles";

export default async function Navigate() {
  const wedding = await prisma.wedding.findFirst();

  if (!wedding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <h2 className="text-2xl text-accent font-heading">Wedding details not found.</h2>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden pb-20">
      <FloatingParticles />
      
      {/* Luxury Glass Header */}
      <div className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <div className="container mx-auto max-w-5xl flex items-center p-4">
          <Link href="/" className="mr-4 bg-white/50 text-primary-dark p-3 rounded-full hover:bg-primary-light hover:scale-105 transition-all shadow-sm">
            <MoveLeft className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-1 font-medium">Your Journey To</p>
            <h1 className="text-lg md:text-2xl font-heading text-primary-dark truncate">
              {wedding.venue_name}
            </h1>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 mt-8 md:mt-12 max-w-5xl">
        
        {/* The Map Experience */}
        <div className="bg-white/70 backdrop-blur-md p-3 md:p-5 rounded-[2rem] shadow-xl shadow-primary-light/30 border border-white/60 mb-12 transform transition hover:shadow-2xl duration-500">
           <NavigationMapWrapper 
            venueLat={wedding.venue_latitude} 
            venueLng={wedding.venue_longitude} 
            venueName={wedding.venue_name} 
          />
        </div>

        {/* Luxury Venue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Main Address Card */}
          <section className="col-span-1 lg:col-span-2 p-8 md:p-10 bg-white/80 backdrop-blur-lg rounded-[2rem] shadow-lg border border-white/50 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-light/50 to-transparent rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 flex items-start">
              <div className="p-4 bg-primary-light/40 rounded-2xl mr-6">
                <MapPin className="w-8 h-8 text-primary-dark" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-heading text-primary-dark mb-4">
                  The Destination
                </h3>
                <p className="text-foreground/80 leading-relaxed font-sans text-lg lg:text-xl">
                  {wedding.venue_address}
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 relative z-10 w-full">
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${wedding.venue_latitude},${wedding.venue_longitude}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-white border border-primary-light text-primary-dark font-medium py-4 rounded-2xl flex items-center justify-center hover:bg-primary-light/30 transition shadow-sm"
              >
                Google Maps
              </a>
              <a 
                href={`http://maps.apple.com/?daddr=${wedding.venue_latitude},${wedding.venue_longitude}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-gradient-to-r from-primary to-[#B38728] text-white font-medium py-4 rounded-2xl flex items-center justify-center hover:shadow-lg hover:shadow-primary/30 transition transform hover:scale-[1.02]"
              >
                Apple Maps
              </a>
            </div>
          </section>

          {/* Logistics & Help Column */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Parking Card */}
            {(wedding.landmarks || wedding.parking_info) && (
              <section className="p-8 bg-white/80 backdrop-blur-lg rounded-[2rem] shadow-lg border border-white/50 flex flex-col justify-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <Car className="w-8 h-8 text-primary/60 mb-4" />
                <h3 className="text-xl font-heading text-primary-dark mb-4">Arrival & Parking</h3>
                {wedding.parking_info && <p className="text-foreground/70 text-sm md:text-base leading-relaxed mb-3"><strong className="text-foreground">Parking:</strong> {wedding.parking_info}</p>}
                {wedding.landmarks && <p className="text-foreground/70 text-sm md:text-base leading-relaxed"><strong className="text-foreground">Landmark:</strong> {wedding.landmarks}</p>}
              </section>
            )}

            {/* Emergency Contact Card */}
            <section className="p-8 bg-white/80 backdrop-blur-lg rounded-[2rem] shadow-lg border border-white/50 flex flex-col justify-center text-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 flex-1">
              <Phone className="w-8 h-8 text-accent mx-auto mb-4 opacity-70" />
              <h3 className="text-xl font-heading text-primary-dark mb-2">Need Assistance?</h3>
              <p className="text-foreground/60 text-sm mb-6">Our wedding coordinators are here to assist you with directions.</p>
              <div className="bg-gradient-to-br from-secondary to-primary-light/20 p-4 rounded-2xl border border-white">
                <p className="text-xs uppercase tracking-[0.2em] text-accent mb-1 font-medium">Contact Line</p>
                <span className="font-heading text-xl text-primary-dark">
                  {wedding.contact_numbers || "Not Provided"}
                </span>
              </div>
            </section>
          </div>
          
        </div>
      </div>
    </main>
  );
}
