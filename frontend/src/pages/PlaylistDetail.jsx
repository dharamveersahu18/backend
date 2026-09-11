import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, Trash2, ListVideo } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import VideoCard from "../components/common/VideoCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { addToast } = useToast();

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/playlists/${playlistId}`);
      setPlaylist(res.data?.data);
    } catch (error) {
      console.error("Failed to load playlist", error);
      addToast("Failed to load playlist", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (playlistId) {
      fetchPlaylist();
    }
  }, [playlistId]);

  const handleRemoveVideo = async (videoId) => {
    try {
      await axiosInstance.patch(`/playlists/remove/${videoId}/${playlistId}`);
      setPlaylist((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));
      addToast("Video removed from playlist", "info");
    } catch (error) {
      addToast("Failed to remove video", "error");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading playlist...</div>;
  }

  if (!playlist) {
    return <div className="p-8 text-center text-zinc-400">Playlist not found.</div>;
  }

  const isOwner = user?._id === (playlist.owner?._id || playlist.owner);

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full pb-12">
      {/* Left Banner Info Card */}
      <div className="w-full lg:w-80 flex flex-col gap-4 p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shrink-0 h-fit">
        <div className="aspect-video w-full rounded-2xl bg-zinc-800 overflow-hidden flex items-center justify-center">
          {playlist.videos?.[0]?.thumbnail ? (
            <img
              src={playlist.videos[0].thumbnail}
              alt="Playlist Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <ListVideo className="w-12 h-12 text-zinc-600" />
          )}
        </div>

        <h1 className="text-xl font-bold text-zinc-100">{playlist.name}</h1>
        <p className="text-xs text-zinc-400">{playlist.description || "No description"}</p>
        <span className="text-xs font-semibold text-purple-400">
          {playlist.videos?.length || 0} Videos
        </span>

        {playlist.videos?.length > 0 && (
          <Link
            to={`/watch/${playlist.videos[0]._id}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md transition mt-2"
          >
            <Play className="w-4 h-4 fill-white" />
            Play All
          </Link>
        )}
      </div>

      {/* Right Video List */}
      <div className="flex-1 flex flex-col gap-4">
        {playlist.videos?.length === 0 ? (
          <div className="py-12 text-center text-zinc-500">
            No videos in this playlist yet. Add videos from any video watch page!
          </div>
        ) : (
          playlist.videos.map((vid, idx) => (
            <div
              key={vid._id}
              className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-purple-500/40 transition gap-4 group"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="text-xs font-bold text-zinc-500 w-4">
                  {idx + 1}
                </span>
                <Link to={`/watch/${vid._id}`} className="shrink-0">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-28 aspect-video object-cover rounded-xl border border-zinc-800"
                  />
                </Link>
                <div className="flex flex-col min-w-0">
                  <Link
                    to={`/watch/${vid._id}`}
                    className="text-sm font-semibold text-zinc-100 group-hover:text-purple-400 truncate transition"
                  >
                    {vid.title}
                  </Link>
                  <span className="text-xs text-zinc-400 mt-1">
                    {vid.owner?.fullName || "Chai aur Code"}
                  </span>
                </div>
              </div>

              {isOwner && (
                <button
                  onClick={() => handleRemoveVideo(vid._id)}
                  className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition"
                  title="Remove from playlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
