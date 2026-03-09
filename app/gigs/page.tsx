"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  duration: string;
  poster: {
    id: string;
    name: string;
    avatar?: string;
  };
  _count: {
    applications: number;
  };
}

const GIG_CATEGORIES = [
  {
    group: "Academic Gigs",
    items: ["Assignment Help", "Research Assistance", "Tutoring", "Notes Sharing", "Presentation Design", "Proofreading"]
  },
  {
    group: "Tech Gigs",
    items: ["Website Development", "App Development", "Software Debugging", "UI/UX Design", "Database Setup"]
  },
  {
    group: "Creative Gigs",
    items: ["Graphic Design", "Logo Design", "Video Editing", "Photography", "Music Production"]
  },
  {
    group: "Digital Work",
    items: ["Social Media Management", "Content Writing", "Blog Writing", "Copywriting", "Data Entry"]
  },
  {
    group: "Physical / Local Gigs",
    items: ["House Cleaning", "Moving Help", "Event Setup", "Delivery Services", "Computer Repair"]
  },
  {
    group: "Campus Specific",
    items: ["Printing Services", "Laptop Repair", "Project Assistance", "Poster Design", "Event Photography"]
  },
  {
    group: "Other",
    items: ["General Task", "Consulting", "Mentoring", "Translation", "Miscellaneous"]
  }
];

export default function GigsPage() {
  const { data: session } = useSession();
  const [posterFilter, setPosterFilter] = useState("");
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const poster = new URLSearchParams(window.location.search).get("poster");
    setPosterFilter(poster || "");
  }, []);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const params = new URLSearchParams();
        if (posterFilter) params.set("poster", posterFilter);
        const qs = params.toString();
        const res = await fetch(`/api/gigs${qs ? `?${qs}` : ""}`);
        const data = await res.json();
        setGigs(data.gigs || []);
      } catch (error) {
        console.error("Error fetching gigs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGigs();
  }, [posterFilter]);

  useEffect(() => {
    let filtered = gigs;
    if (selectedCategory) {
      filtered = filtered.filter(g => g.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredGigs(filtered);
  }, [gigs, selectedCategory, searchTerm]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Guest CTA banner */}
      {!session && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <p className="text-amber-900 text-sm">
              👋 You&apos;re browsing as a guest. Sign up to apply for tasks!
            </p>
            <Link href="/signup">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700">Sign up free</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Available Tasks</h1>
          {session && (
            <Link href="/post-gig">
              <Button className="bg-emerald-600 hover:bg-emerald-700">+ Post a Task</Button>
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-slate-900"
          />
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === ""
                  ? "bg-amber-600 text-white"
                  : "bg-white border border-slate-300 text-slate-700 hover:border-amber-300"
              }`}
            >
              All Categories
            </button>
          </div>
          {GIG_CATEGORIES.map((group) => (
            <div key={group.group} className="mb-4">
              <h4 className="text-xs font-bold text-slate-600 uppercase mb-2">{group.group}</h4>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedCategory(item)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedCategory === item
                        ? "bg-amber-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Gigs Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading tasks...</p>
          </div>
        ) : filteredGigs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg mb-4">No tasks found</p>
            {!session && (
              <Link href="/signup">
                <Button className="bg-amber-600 hover:bg-amber-700">Sign up to post a task</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map((gig) => (
              <Link key={gig.id} href={`/gig/${gig.id}`}>
                <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg hover:border-amber-300 transition-all cursor-pointer h-full flex flex-col">
                  <div className="mb-4">
                    <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {gig.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 flex-grow">
                    {gig.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {gig.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-emerald-600">
                      KES {gig.budget}
                    </span>
                    <span className="text-slate-500 text-sm">
                      {gig.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-sm">
                    <span className="text-slate-700 font-medium">
                      {gig.poster.name}
                    </span>
                    <span className="text-slate-600">
                      {gig._count.applications} applicants
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
