"use client";

import { useEffect, useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  /*Live search on input change
  useEffect(() => {
    onSearch(query.trim());
  }, [query, onSearch]);
*/
  // Handle form submission without page reload
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  // Clear search input and results
  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex items-center bg-gray-900 rounded-2xl overflow-hidden shadow-md"
      autoComplete="off"
    >
      <input
        type="text"
        placeholder="Search movies by title or director..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 px-4 py-2 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-l-2xl"
      />

      <button
        type="submit"
        className="p-3 bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center"
        aria-label="Search"
      >
        <MagnifyingGlassIcon className="w-5 h-5 text-white" />
      </button>

      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="p-3 bg-gray-600 hover:bg-gray-700 transition flex items-center justify-center rounded-r-2xl"
          aria-label="Clear search"
        >
          <XMarkIcon className="w-5 h-5 text-white" />
        </button>
      )}
    </form>
  );
}
