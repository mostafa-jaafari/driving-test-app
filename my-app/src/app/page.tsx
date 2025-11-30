"use client";
import Link from "next/link";
import { EXAM_SERIES } from "@/lib/data"; // Ensure you have the data.ts from previous steps
import { Lock, Unlock, PlayCircle, Star, AlertCircle, Play } from "lucide-react";
import LandingPage from "@/components/LandingPage";

export default function Dashboard() {
  return (
    <LandingPage />
  );
}