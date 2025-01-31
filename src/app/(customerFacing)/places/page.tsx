import React from "react";
import BrasovSquare from "../../../components/BrasovSquare";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <div>
        <h1 className="text-3xl font-semibold text-center py-8">Welcome to Brasov</h1>
        <h2 className="text-xl font-semibold text-center pb-8">The city of adventure</h2>
      </div>
      <main className="flex items-center justify-center py-8">
        <div className="relative w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden" style={{ paddingTop: "28.125%" }}>
          <div className="absolute inset-0">
            <BrasovSquare />
          </div>
        </div>
      </main>
    </div>
  );
}