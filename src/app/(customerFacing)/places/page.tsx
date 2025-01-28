import React from "react";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import BrasovSquare from "../../../components/BrasovSquare";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-800 h-450 bg-white shadow-lg rounded-lg text-center p-4">
        <BrasovSquare />
      </div>
    </div>
  );
}