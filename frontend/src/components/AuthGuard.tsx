"use client";

import { useEffect } from "react";
import { getToken } from "@/utils/auth";

export default function AuthGuard({ children }: any) {
  useEffect(() => {
    const token = getToken();

    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  return children;
}