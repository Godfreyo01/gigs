"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

interface Gig {
  id: string;
  title: string;
  category: string;
  budget: number;
  duration: string;
  poster: { name: string };
  _count: { applications: number };
}

interface Project {
  id: string;
  title: string;
  category: string;
  _count: { members: number };
  maxMembers: number;
  createdBy: { name: string };
}

interface PlatformStats {
  totalUsers: number;
  totalGigs: number;
  totalProjects: number;
}

export default function Home() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<PlatformStats>({ totalUsers: 0, totalGigs: 0, totalProjects: 0 });
  const [recentGigs, setRecentGigs] = useState<Gig[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    // Fetch live platform stats
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setStatsLoaded(true); })
      .catch(() => setStatsLoaded(true));

    // Fetch 3 most recent gigs
    fetch("/api/gigs?take=3")
      .then((r) => r.json())
      .then((d) => setRecentGigs(d.gigs || []))
      .catch(() => {});

    // Fetch 2 most recent projects
    fetch("/api/projects?take=2")
      .then((r) => r.json())
      .then((d) => setRecentProjects(d.projects || []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-white to-blue-100/20 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 rounded-full px-4 py-1.5 text-sm text-amber-700 mb-8">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            For students, by students
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
            Campus{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Task Hive
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Get academic help, find tech talent, share campus services, and collaborate with fellow students—all in one buzzing hive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/gigs">
              <Button size="lg" className="px-8 bg-amber-600 hover:bg-amber-700">Available Tasks</Button>
            </Link>
            <Link href="/gigs">
              <Button size="lg" variant="outline" className="px-8 border-amber-300 text-amber-700 hover:bg-amber-50">
                Explore Projects
              </Button>
            </Link>
          </div>

          {/* Stats bar — live */}
          <div className="grid grid-cols-3 gap-6 mt-20 max-w-xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-amber-600">
                {!statsLoaded ? <span className="inline-block w-10 h-8 bg-slate-200 rounded animate-pulse" /> : stats.totalGigs}
              </div>
              <p className="text-slate-600 text-sm mt-1">Tasks Posted</p>
            </div>
            <div className="border-x border-slate-300">
              <div className="text-3xl font-bold text-blue-600">
                {!statsLoaded ? <span className="inline-block w-10 h-8 bg-slate-200 rounded animate-pulse" /> : stats.totalProjects}
              </div>
              <p className="text-slate-600 text-sm mt-1">Active Projects</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600">
                {!statsLoaded ? <span className="inline-block w-10 h-8 bg-slate-200 rounded animate-pulse" /> : stats.totalUsers}
              </div>
              <p className="text-slate-600 text-sm mt-1">Students</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-14">How the Hive Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { step: "01", icon: "🔍", title: "Browse freely", desc: "Explore academic help, tech tasks, creative gigs, and campus services—no account required to look around." },
            { step: "02", icon: "✍️", title: "Join the Hive", desc: "Sign up in seconds with just your name and email. Free forever, no credit cards, no setup fees." },
            { step: "03", icon: "🚀", title: "Post or Apply", desc: "Post your task and find talented helpers, or apply for tasks that match your skills and schedule." },
          ].map((item) => (
            <div key={item.step} className="relative">
              <div className="text-6xl font-black text-amber-100 mb-4 select-none">{item.step}</div>
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample Gigs preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 bg-gradient-to-b from-transparent to-slate-100/50 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Recent Tasks</h2>
          <Link href="/gigs" className="text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors">
            View all →
          </Link>
        </div>
        {recentGigs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
            No tasks posted yet.{" "}
            {session ? (
              <Link href="/post-gig" className="text-amber-600 hover:underline">Be the first to post one!</Link>
            ) : (
              <Link href="/signup" className="text-amber-600 hover:underline">Sign up to post the first task!</Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentGigs.map((gig) => (
              <Link key={gig.id} href={`/gig/${gig.id}`}>
                <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-amber-300 hover:shadow-lg transition-all group h-full">
                  <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium mb-4">
                    {gig.category}
                  </span>
                  <h3 className="text-slate-900 font-semibold mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">{gig.title}</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-emerald-600 font-bold text-lg">${gig.budget}</span>
                    <span className="text-slate-500">{gig.duration}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                    <span>{gig.poster.name}</span>
                    <span>{gig._count.applications} applicants</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Sample Projects preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Open Projects</h2>
          <Link href="/projects" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
            View all →
          </Link>
        </div>
        {recentProjects.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500">
            No projects yet.{" "}
            {session ? (
              <Link href="/create-project" className="text-blue-600 hover:underline">Start the first project!</Link>
            ) : (
              <Link href="/signup" className="text-blue-600 hover:underline">Sign up to create a project!</Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentProjects.map((proj) => (
              <Link key={proj.id} href={`/project/${proj.id}`}>
                <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all group h-full">
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-4">
                    {proj.category.replace("-", " ")}
                  </span>
                  <h3 className="text-slate-900 font-semibold mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">{proj.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">{proj.createdBy.name}</span>
                    <span className="text-slate-500 text-sm">{proj._count.members}/{proj.maxMembers} members</span>
                  </div>
                  <div className="mt-3 w-full bg-slate-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${(proj._count.members / proj.maxMembers) * 100}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner — only for guests */}
      {!session && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Ready to join the Hive?</h2>
            <p className="text-slate-700 mb-8 max-w-md mx-auto">
              Get academic help, find tech talent, share services, and collaborate with students today.
            </p>
            <Link href="/signup">
              <Button size="lg" className="px-10 bg-amber-600 hover:bg-amber-700">Create free account</Button>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-gradient-to-b from-white to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐝</span>
              <span className="text-slate-900 font-semibold">Campus Task Hive</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-600">
              <Link href="/gigs" className="hover:text-slate-900 transition-colors">Tasks</Link>
              <Link href="/projects" className="hover:text-slate-900 transition-colors">Projects</Link>
              <Link href="/signup" className="hover:text-slate-900 transition-colors">Sign Up</Link>
            </div>
            <p className="text-slate-600 text-sm">© 2026 Campus Task Hive</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
