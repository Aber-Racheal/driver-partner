"use client";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-6">
      <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
    </div>
  );
}
