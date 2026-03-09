"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Watch for session changes to redirect
  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      router.push("/admin");
    } else if (session?.user) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (!result?.ok) {
        throw new Error("Incorrect credentials");
      }

      // The useEffect hook will handle the redirect based on the session
    } catch {
      setError("Incorrect credentials");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-3xl">🐝</span>
        <h1 className="text-3xl font-bold text-slate-900">Task Hive</h1>
      </div>
      <p className="text-slate-600 mb-8">Sign in to your account</p>

      {registered && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-md mb-6">
          Account created! Please log in.
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200"
            placeholder="Greg Org"
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
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200"
            placeholder="••••••••"
          />
        </div>

        <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="text-slate-600 text-sm mt-6 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-amber-600 hover:text-amber-700 font-medium">
          Sign up here
        </Link>
      </p>
    </>
  );
}

