"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FreelancerSignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      setIsLoading(false);
      return;
    }

    if (!formData.username.match(/^[a-zA-Z0-9_-]+$/)) {
      setError("Username can only contain letters, numbers, underscores, and hyphens");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          phone: formData.phone || null,
          password: formData.password,
          role: "FREELANCER",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Signup failed");
      }

      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/signup" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm">
            ← Back to role selection
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">💼</span>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Freelancer</h1>
              <p className="text-slate-600 text-sm">Join as a skilled professional</p>
            </div>
          </div>
          <p className="text-slate-600 mb-8">Create your account to start completing gigs and earning money</p>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-900 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                placeholder="Greg Org"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-900 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                placeholder="greg_org"
              />
              <p className="text-slate-600 text-xs mt-1">3+ characters (letters, numbers, _, -)</p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-900 mb-2">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                placeholder="+254700000000"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-900 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                placeholder="••••••••"
              />
              <p className="text-slate-600 text-xs mt-1">Minimum 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-900 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                placeholder="••••••••"
              />
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Freelancer Account"}
            </Button>
          </form>

          <p className="text-slate-600 text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
