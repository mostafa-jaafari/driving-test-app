import type { Metadata } from "next";
import { Cairo } from "next/font/google"; // Cairo is excellent for Arabic
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}