"use client";

import { useEffect, type ReactNode } from "react";
import { getToken } from "@/utils/auth";

export default function AuthGuard({ children }: { children: ReactNode }) {
  useEffect(() => {
    const token = getToken();

    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  return children;
}