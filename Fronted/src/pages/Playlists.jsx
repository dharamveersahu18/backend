import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ListVideo, Plus, Trash2 } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Modal from "../components/common/Modal";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { user } = useAuth();
  const { addToast } = useToast();

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/playlists/user/${user._id}`);
      setPlaylists(res.data?.data || []);
    } catch (error) {
      console.error("Failed to load playlists", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchPlaylists();
    }
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await axiosInstance.post("/playlists", {
        name: name.trim(),
        description: description.trim(),
      });
      setPlaylists((prev) => [res.data.data, ...prev]);
      setName("");
      setDescription("");
      setCreateModalOpen(false);
      addToast("Playlist created!", "success");
    } catch (error) {
      addToast("Failed to create playlist", "error");
    }
  };

  const handleDelete = async (e, playlistId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this playlist?")) return;

    try {
      await axiosInstance.delete(`/playlists/${playlistId}`);
      setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
      addToast("Playlist deleted", "info");
    } catch (error) {
      addToast("Failed to delete playlist", "error");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading playlists...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Playlists</h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Organize your favorite collections
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="py-16 text-center text-zinc-500 flex flex-col items-center gap-3">
          <ListVideo className="w-12 h-12 text-zinc-600" />
          <p>No playlists created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map((pl) => (
            <Link
              key={pl._id}
              to={`/playlist/${pl._id}`}
              className="group p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 flex flex-col justify-between gap-4 transition shadow-md"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center">
                    <ListVideo className="w-5 h-5" />
                  </span>
                  <button
                    onClick={(e) => handleDelete(e, pl._id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-base font-semibold text-zinc-100 group-hover:text-purple-400 transition mt-2 truncate">
                  {pl.name}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2">
                  {pl.description || "No description"}
                </p>
              </div>
              <span className="text-xs text-zinc-500 font-medium">
                {pl.videos?.length || 0} videos
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Playlist"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Playlist Name
            </label>
            <input
              type="text"
              placeholder="e.g. Favorite React Tutorials"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-zinc-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Description (optional)
            </label>
            <textarea
              rows={3}
              placeholder="Description of this collection..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-zinc-100 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md transition disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Playlists;
