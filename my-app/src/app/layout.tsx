import type { Metadata } from "next";
import { Cairo } from "next/font/google"; 
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import Navbar

const cairo = Cairo({ subsets: ["arabic", "latin"] });

export const metadata: Metadata = {
  title: "Moroccan Driving Exam Simulator",
  description: "Test your knowledge of the Moroccan driving code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-slate-50 text-slate-900`}>
        <Navbar /> {/* Add Navbar here */}
        {children}
      </body>
    </html>
  );
}