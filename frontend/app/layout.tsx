import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriFlow - AI-Powered Meal Planning",
  description: "Get personalized, science-based meal plans powered by AI. Calculate your perfect calorie intake and macros based on your fitness goals.",
  keywords: "nutrition, meal planning, calorie calculator, fitness, diet, health, macros",
  authors: [{ name: "NutriFlow Team" }],
  creator: "NutriFlow",
  publisher: "NutriFlow",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nutriflow.app",
    title: "NutriFlow - Personalized Meal Plans",
    description: "AI-powered nutrition planning for your fitness goals",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NutriFlow",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriFlow - Meal Planning Made Easy",
    description: "Personalized nutrition plans powered by AI",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "light",
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75'>🥗</text></svg>" />
      </head>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 to-neutral-100">
        <main className="flex-1">
          {children}
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#ffffff",
              color: "#111827",
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
            },
            success: {
              style: {
                background: "#f0fdf4",
                color: "#15803d",
              },
              iconTheme: {
                primary: "#10b981",
                secondary: "#f0fdf4",
              },
            },
            error: {
              style: {
                background: "#fef2f2",
                color: "#991b1b",
              },
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fef2f2",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
