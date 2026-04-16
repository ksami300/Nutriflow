"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="text-center space-y-4 animate-slideUp">
        <div className="w-16 h-16 rounded-full border-4 border-neutral-200 border-t-primary-600 animate-spin mx-auto"></div>
        <h1 className="text-3xl font-bold text-neutral-900">NutriFlow</h1>
        <p className="text-neutral-600">Loading your nutrition journey...</p>
      </div>
    </div>
  );
}