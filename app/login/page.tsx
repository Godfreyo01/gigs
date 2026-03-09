import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm">
            ← Back to home
          </Link>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <Suspense fallback={<div className="text-white">Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
