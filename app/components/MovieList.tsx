"use client";

import { useEffect, useState, useRef } from "react";
import { databases, DATABASE_ID, COLLECTION_ID } from "@/lib/appwrite";
import { Models, Query } from "appwrite";
import MovieCard from "./MovieCard";
import SearchBar from "./SearchBar";

interface Movie {
  $id: string;
  title: string;
  director: string;
  release_year: number;
}

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const pageSize = 9;

  const [sortField, setSortField] = useState<"title" | "release_year">("title");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  const [searchQuery, setSearchQuery] = useState("");

  const sliderRef = useRef<HTMLDivElement>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let docs: Models.Document[] = [];

      if (searchQuery.trim() !== "") {
        const [titleRes, directorRes] = await Promise.all([
          databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.contains("title", [searchQuery]),
          ]),
          databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.contains("director", [searchQuery]),
          ]),
        ]);

        const map = new Map<string, Models.Document>();
        [...titleRes.documents, ...directorRes.documents].forEach((doc) =>
          map.set(doc.$id, doc)
        );
        docs = Array.from(map.values());

        docs.sort((a, b) => {
          const aMovie = a as unknown as Movie;
          const bMovie = b as unknown as Movie;

          if (sortField === "title") {
            return sortOrder === "ASC"
              ? aMovie.title.localeCompare(bMovie.title)
              : bMovie.title.localeCompare(aMovie.title);
          } else {
            return sortOrder === "ASC"
              ? aMovie.release_year - bMovie.release_year
              : bMovie.release_year - aMovie.release_year;
          }
        });

        const start = page * pageSize;
        docs = docs.slice(start, start + pageSize);
      } else {
        const queries: any[] = [
          Query.limit(pageSize),
          Query.offset(page * pageSize),
        ];
        if (sortOrder === "ASC") {
          queries.push(Query.orderAsc(sortField));
        } else {
          queries.push(Query.orderDesc(sortField));
        }
        const res = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          queries
        );
        docs = res.documents;
      }

      setMovies(
        docs.map((doc) => {
          const movie = doc as unknown as Movie;
          return {
            $id: movie.$id,
            title: movie.title,
            director: movie.director,
            release_year: movie.release_year,
          };
        })
      );
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateMovieInDB = async (
    movieId: string,
    updatedData: { title: string; director: string; release_year: number }
  ) => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        movieId,
        updatedData
      );
      console.log("Movie updated in database:", movieId);
    } catch (error) {
      console.error("Failed to update movie in database:", error);
      alert("Error updating movie in database. Please try again.");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page, sortField, sortOrder, searchQuery]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const interval = setInterval(() => {
      if (slider) {
        const scrollAmount = 220;
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
          slider.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [movies]);

  const handleEditRequest = (movieId: string) => {
    if (editingId && editingId !== movieId) {
      alert("Please save or cancel changes before editing another movie.");
      return false;
    }
    setEditingId(movieId);
    return true;
  };

  const handleSave = async (
    movieId: string,
    updated: { title: string; director: string; release_year: number }
  ) => {
    setMovies((prev) =>
      prev.map((m) => (m.$id === movieId ? { ...m, ...updated } : m))
    );
    setEditingId(null);
    await updateMovieInDB(movieId, updated);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  if (loading)
    return (
      <p className="text-gray-300 text-center mt-10 text-lg tracking-wide">
        Loading movies...
      </p>
    );

  return (
    <div className="p-6 min-h-screen bg-neutral-950">
      <div className="mb-8">
        <SearchBar
          onSearch={(query) => {
            setSearchQuery(query);
            setPage(0);
            setEditingId(null);
          }}
        />
      </div>

      <div className="flex justify-between items-center mb-8 bg-gray-900 p-4 rounded-lg shadow-md">
        <div className="flex gap-3 items-center">
          <label className="text-sm font-medium text-gray-300">Sort by:</label>
          <select
            value={sortField}
            onChange={(e) =>
              setSortField(e.target.value as "title" | "release_year")
            }
            className="p-2 rounded-lg text-black focus:outline-none"
          >
            <option value="title">Title</option>
            <option value="release_year">Release Year</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "ASC" | "DESC")}
            className="p-2 rounded-lg text-black focus:outline-none"
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-white tracking-wide">
        Featured Movies
      </h2>
      <div
        ref={sliderRef}
        className="flex overflow-x-auto gap-6 pb-5 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900"
      >
        {movies.map((movie) => (
          <div key={movie.$id} className="min-w-[200px]">
            <MovieCard
              id={movie.$id}
              title={movie.title}
              director={movie.director}
              release_year={movie.release_year}
              isEditing={editingId === movie.$id}
              onEditRequest={() => handleEditRequest(movie.$id)}
              onSave={(updated) => handleSave(movie.$id, updated)}
              onCancel={handleCancel}
            />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-10 mb-6 text-white tracking-wide">
        All Movies
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {movies.map((movie) => (
          <MovieCard
            key={movie.$id}
            id={movie.$id}
            title={movie.title}
            director={movie.director}
            release_year={movie.release_year}
            isEditing={editingId === movie.$id}
            onEditRequest={() => handleEditRequest(movie.$id)}
            onSave={(updated) => handleSave(movie.$id, updated)}
            onCancel={handleCancel}
          />
        ))}
      </div>

      <div className="flex justify-between items-center mt-12">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="px-6 py-2 bg-neutral-800 text-white rounded-full shadow hover:bg-neutral-700 transition disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm font-medium text-gray-300">Page {page + 1}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-6 py-2 bg-neutral-800 text-white rounded-full shadow hover:bg-neutral-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
