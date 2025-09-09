import { useState, useEffect } from "react";

interface MovieCardProps {
  id: string;
  title: string;
  director: string;
  release_year: number;
  isEditing: boolean;
  onEditRequest: () => boolean;
  onSave: (updated: { title: string; director: string; release_year: number }) => void;
  onCancel: () => void;
}

export default function MovieCard({
  id,
  title,
  director,
  release_year,
  isEditing,
  onEditRequest,
  onSave,
  onCancel,
}: MovieCardProps) {
  const [editTitle, setEditTitle] = useState(title);
  const [editDirector, setEditDirector] = useState(director);
  const [editYear, setEditYear] = useState(release_year.toString());

  // Reset local edit state when edit mode toggles off/on
  useEffect(() => {
    if (!isEditing) {
      setEditTitle(title);
      setEditDirector(director);
      setEditYear(release_year.toString());
    }
  }, [isEditing, title, director, release_year]);

  const handleEditClick = () => {
    const granted = onEditRequest();
    if (!granted) {
      alert("Please save or cancel the previous edit before editing another movie.");
    }
  };

  const handleSave = () => {
    const yearNum = Number(editYear);
    if (isNaN(yearNum)) {
      alert("Release year must be a valid number");
      return;
    }
    onSave({
      title: editTitle.trim(),
      director: editDirector.trim(),
      release_year: yearNum,
    });
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 w-[200px] h-auto flex flex-col justify-end relative overflow-hidden p-4">
      {isEditing ? (
        <>
          <label className="text-sm font-semibold text-white mb-1">Title</label>
          <input
            type="text"
            className="mb-3 rounded px-2 py-1 text-black w-full"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
          />

          <label className="text-sm font-semibold text-white mb-1">Director</label>
          <input
            type="text"
            className="mb-3 rounded px-2 py-1 text-black w-full"
            value={editDirector}
            onChange={(e) => setEditDirector(e.target.value)}
            placeholder="Director"
          />

          <label className="text-sm font-semibold text-white mb-1">Release Year</label>
          <input
            type="number"
            className="mb-4 rounded px-2 py-1 text-black w-full"
            value={editYear}
            onChange={(e) => setEditYear(e.target.value)}
            placeholder="Release Year"
          />

          <div className="flex justify-between">
            <button
              onClick={handleSave}
              className="bg-green-600 rounded px-3 py-1 text-white hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-600 rounded px-3 py-1 text-white hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold truncate text-white">{title}</h2>
          <p className="text-xs opacity-80 text-white">🎬 {director}</p>
          <p className="text-xs opacity-70 text-white">📅 {release_year}</p>
          <button
            onClick={handleEditClick}
            className="absolute top-2 right-2 bg-blue-600 px-2 py-1 rounded text-white hover:bg-blue-700"
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
}
