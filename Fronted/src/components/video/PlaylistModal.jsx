import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Modal from "../common/Modal";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const PlaylistModal = ({ isOpen, onClose, videoId }) => {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen && user?._id) {
      fetchPlaylists();
    }
  }, [isOpen, user]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/playlists/user/${user._id}`);
      if (res.data?.data) {
        setPlaylists(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load playlists", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVideoInPlaylist = async (playlist) => {
    const isVideoInPlaylist = playlist.videos?.some(
      (v) => (v._id || v).toString() === videoId.toString()
    );

    try {
      if (isVideoInPlaylist) {
        await axiosInstance.patch(`/playlists/remove/${videoId}/${playlist._id}`);
        addToast(`Removed from ${playlist.name}`, "info");
      } else {
        await axiosInstance.patch(`/playlists/add/${videoId}/${playlist._id}`);
        addToast(`Added to ${playlist.name}`, "success");
      }
      fetchPlaylists();
    } catch (error) {
      addToast("Failed to update playlist", "error");
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      setCreating(true);
      const res = await axiosInstance.post("/playlists", {
        name: newPlaylistName.trim(),
      });
      const newPlaylist = res.data.data;
      if (videoId) {
        await axiosInstance.patch(`/playlists/add/${videoId}/${newPlaylist._id}`);
      }
      addToast(`Playlist "${newPlaylist.name}" created! `, "success");
      setNewPlaylistName("");
      fetchPlaylists();
    } catch (error) {
      addToast("Failed to create playlist", "error");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save to playlist" maxWidth="max-w-md">
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-zinc-500 text-sm py-3">Loading playlists...</div>
        ) : (
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {playlists.map((playlist) => {
              const isChecked = playlist.videos?.some(
                (v) => (v._id || v).toString() === videoId.toString()
              );

              return (
                <label
                  key={playlist._id}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-800/80 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleVideoInPlaylist(playlist)}
                    className="w-4 h-4 rounded text-purple-600 bg-zinc-800 border-zinc-700 focus:ring-purple-500"
                  />
                  <span className="text-sm text-zinc-200 font-medium truncate">
                    {playlist.name}
                  </span>
                </label>
              );
            })}
          </div>
        )}

        <form
          onSubmit={handleCreatePlaylist}
          className="pt-4 border-t border-zinc-800 flex flex-col gap-3"
        >
          <input
            type="text"
            placeholder="Create new playlist name..."
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-zinc-100 outline-none"
          />
          <button
            type="submit"
            disabled={creating || !newPlaylistName.trim()}
            className="flex items-center justify-center gap-2 w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md transition disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Create Playlist
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default PlaylistModal;
