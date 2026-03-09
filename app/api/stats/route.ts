import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/stats — public platform-wide counts, no auth required
export async function GET() {
  try {
    const [totalGigs, totalProjects, freelancers, clients, totalUsers] = await Promise.all([
      prisma.gig.count({ where: { status: "open" } }),
      prisma.project.count({ where: { status: "open" } }),
      prisma.user.count({ where: { role: "FREELANCER" } }),
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.user.count(),
    ]);

    return NextResponse.json({ 
      totalGigs, 
      totalProjects, 
      freelancers,
      clients,
      totalUsers 
    });
  } catch (error) {
    console.error("Error fetching public stats:", error);
    return NextResponse.json({ 
      totalGigs: 0, 
      totalProjects: 0, 
      freelancers: 0,
      clients: 0,
      totalUsers: 0 
    });
  }
}
