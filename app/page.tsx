"use client";

import { useState } from "react";
import MovieList from "./components/MovieList";

export default function HomePage() {
  return (
    <main className="bg-black min-h-screen text-white p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">🎬 Movie Explorer</h1>
      <MovieList />
    </main>
  );
}
