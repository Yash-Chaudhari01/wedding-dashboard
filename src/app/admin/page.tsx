import { prisma } from "@/lib/prisma";
import DashboardForm from "@/components/admin/DashboardForm";

export default async function AdminPage() {
  let wedding = await prisma.wedding.findFirst();

  if (!wedding) {
    wedding = await prisma.wedding.create({
      data: {
        bride_name: "Sarah",
        groom_name: "John",
        wedding_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        venue_name: "The Grand Manor",
        venue_address: "123 Wedding Lane, Love City",
        venue_latitude: 40.7128,
        venue_longitude: -74.0060,
        contact_numbers: "+1 (555) 123-4567"
      }
    });
  }

  const visitsCount = await prisma.guestVisit.count({
    where: { wedding_id: wedding.id }
  });

  return (
    <main className="min-h-screen bg-background">
      <header className="bg-primary-dark text-white p-4 shadow-md flex justify-between items-center px-4 md:px-8">
        <h1 className="text-xl font-heading font-medium tracking-wide">
          Wedding Admin Dashboard
        </h1>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <DashboardForm wedding={wedding} visitsCount={visitsCount} />
      </div>
    </main>
  );
}
