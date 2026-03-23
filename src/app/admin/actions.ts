"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function hashPassword(password: string) {
  const enc = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function loginOrRegister(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const hp = await hashPassword(password);

  const existingAdminCount = await prisma.admin.count();
  const cookieStore = await cookies();
  
  if (existingAdminCount === 0) {
    const newWedding = await prisma.wedding.create({
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

    await prisma.admin.create({
      data: {
        email,
        password_hash: hp,
        wedding_id: newWedding.id
      }
    });

    cookieStore.set("admin_session", email, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    revalidatePath("/admin");
    return { success: true };
  } else {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (admin && admin.password_hash === hp) {
      cookieStore.set("admin_session", email, { httpOnly: true });
      revalidatePath("/admin");
      return { success: true };
    }
  }
  
  return { error: "Invalid credentials." };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  revalidatePath("/admin");
}

export async function updateWeddingInfo(prevState: any, formData: FormData) {
  const wedding = await prisma.wedding.findFirst();
  if (!wedding) return { error: "No wedding found" };

  try {
    await prisma.wedding.update({
      where: { id: wedding.id },
      data: {
        bride_name: formData.get("bride_name") as string,
        groom_name: formData.get("groom_name") as string,
        wedding_date: new Date(formData.get("wedding_date") as string),
        venue_name: formData.get("venue_name") as string,
        venue_address: formData.get("venue_address") as string,
        venue_latitude: parseFloat(formData.get("venue_latitude") as string),
        venue_longitude: parseFloat(formData.get("venue_longitude") as string),
        parking_info: formData.get("parking_info") as string,
        landmarks: formData.get("landmarks") as string,
        contact_numbers: formData.get("contact_numbers") as string,
      }
    });
    revalidatePath("/");
    revalidatePath("/navigate");
    revalidatePath("/admin");
    return { success: true, message: "Settings saved successfully!" };
  } catch (error) {
    return { error: "Failed to update details. Check the format." };
  }
}
