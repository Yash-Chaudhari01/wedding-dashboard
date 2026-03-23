import { prisma } from "@/lib/prisma";
import CinematicJourney from "@/components/CinematicJourney";

export default async function Home() {
  // Pass down standard logic but fully delegate UI to the client architect.
  const wedding = await prisma.wedding.findFirst();

  if (!wedding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <p className="text-white/50 text-xl font-heading tracking-widest">Awaiting Configuration</p>
      </div>
    );
  }

  return (
    <CinematicJourney 
      bride={wedding.bride_name} 
      groom={wedding.groom_name} 
      venueLat={wedding.venue_latitude} 
      venueLng={wedding.venue_longitude} 
      venueName={wedding.venue_name} 
    />
  );
}
