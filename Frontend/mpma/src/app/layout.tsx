import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";

// * Font configuration for the application
// * Geist Sans for regular text and Geist Mono for code/monospaced text
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ! Metadata for the application providing SEO information
// ! This appears in browser tabs and search engine results
export const metadata: Metadata = {
  title: "MPMA - Mahapola Port and Maritime Academy",
  description: "Learning Management System for MPMA",
};

// ! Root layout component that wraps the entire application
// ! Provides essential providers and configuration for all pages
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 
          ? Provider hierarchy:
          ? 1. AuthProvider - Manages authentication state
          ? 2. ThemeProvider - Manages theme (dark/light) preferences
        */}
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
