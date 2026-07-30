import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast"; // 🔔 NATIVNI INTEGRACIONI PROZOR ZA ALARME
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriFlow",
  description: "AI-powered nutrition and meal planning for busy lifestyles.",
  manifest: "/manifest.json",
  icons: {
    icon: "/file.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-white">
        {/* Globalni kontejner za asinhrona obaveštenja */}
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
