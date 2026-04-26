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
  userScalable: false,
  colorScheme: "dark",
  themeColor: "#0f172a",
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75'>🥗</text></svg>" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden">
        <main className="flex-1">
          {children}
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#111827",
              color: "#e2e8f0",
              borderRadius: "16px",
              boxShadow: "0 24px 60px rgba(15, 23, 42, 0.65)",
              border: "1px solid rgba(148, 163, 184, 0.16)",
            },
            success: {
              style: {
                background: "#0f172a",
                color: "#34d399",
              },
              iconTheme: {
                primary: "#34d399",
                secondary: "#0f172a",
              },
            },
            error: {
              style: {
                background: "#0f172a",
                color: "#fb7185",
              },
              iconTheme: {
                primary: "#fb7185",
                secondary: "#0f172a",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
