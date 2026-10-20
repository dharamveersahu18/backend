import React, { useState, useEffect } from "react";
import {
  Eye,
  Users,
  ThumbsUp,
  Video,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Plus,
} from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import EditVideoModal from "../components/video/EditVideoModal";
import UploadVideoModal from "../components/video/UploadVideoModal";
import { useToast } from "../context/ToastContext";

const CreatorStudio = () => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const { addToast } = useToast();

  const fetchStudioData = async () => {
    try {
      setLoading(true);
      const [statsRes, vidsRes] = await Promise.all([
        axiosInstance.get("/dashboard/stats"),
        axiosInstance.get("/dashboard/videos"),
      ]);
      setStats(statsRes.data?.data);
      setVideos(vidsRes.data?.data || []);
    } catch (error) {
      console.error("Failed to load studio data", error);
      addToast("Failed to load Creator Studio", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudioData();
  }, []);

  const handleTogglePublish = async (videoId) => {
    try {
      const res = await axiosInstance.patch(`/videos/toggle/publish/${videoId}`);
      const { isPublished } = res.data?.data || {};
      setVideos((prev) =>
        prev.map((v) => (v._id === videoId ? { ...v, isPublished } : v))
      );
      addToast(
        `Video marked as ${isPublished ? "Public" : "Private"}`,
        "info"
      );
    } catch (error) {
      addToast("Failed to toggle publish status", "error");
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to permanently delete this video?"))
      return;

    try {
      await axiosInstance.delete(`/videos/${videoId}`);
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
      addToast("Video deleted successfully", "info");
      // Update stats count
      setStats((prev) => ({
        ...prev,
        totalVideos: Math.max(0, (prev?.totalVideos || 0) - 1),
      }));
    } catch (error) {
      addToast("Failed to delete video", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-zinc-500">Loading Creator Studio...</div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Creator Studio</h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Channel analytics and content management
          </p>
        </div>
        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/30 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Upload Video
        </button>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Total Views</span>
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-2xl font-bold text-zinc-100">
            {stats?.totalViews || 0}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Subscribers</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl font-bold text-zinc-100">
            {stats?.totalSubscribers || 0}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Total Likes</span>
            <ThumbsUp className="w-4 h-4 text-pink-400" />
          </div>
          <span className="text-2xl font-bold text-zinc-100">
            {stats?.totalLikes || 0}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">Total Videos</span>
            <Video className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold text-zinc-100">
            {stats?.totalVideos || 0}
          </span>
        </div>
      </div>

      {/* Videos Management Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-zinc-800">
          <h3 className="text-base font-semibold text-zinc-100">Your Uploads</h3>
        </div>

        {videos.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-sm">
            No videos uploaded yet. Click "Upload Video" to publish your first content!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950/60 text-xs font-semibold uppercase text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-5 py-3">Video</th>
                  <th className="px-5 py-3">Visibility</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Views</th>
                  <th className="px-5 py-3">Likes</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {videos.map((vid) => (
                  <tr key={vid._id} className="hover:bg-zinc-800/40 transition">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-20 aspect-video object-cover rounded-lg shrink-0 border border-zinc-800"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-zinc-100 truncate max-w-xs">
                          {vid.title}
                        </span>
                        <span className="text-xs text-zinc-500 truncate max-w-xs">
                          {vid.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleTogglePublish(vid._id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                          vid.isPublished
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        }`}
                      >
                        {vid.isPublished ? (
                          <>
                            <ToggleRight className="w-4 h-4" /> Public
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4" /> Private
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-xs text-zinc-400">
                      {new Date(vid.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-xs text-zinc-300">
                      {vid.views || 0}
                    </td>
                    <td className="px-5 py-3 text-xs text-zinc-300">
                      {vid.likesCount || 0}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedVideo(vid);
                            setEditModalOpen(true);
                          }}
                          className="p-1.5 text-zinc-400 hover:text-purple-400 hover:bg-zinc-800 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(vid._id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {selectedVideo && (
        <EditVideoModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedVideo(null);
          }}
          video={selectedVideo}
          onVideoUpdated={(updated) => {
            setVideos((prev) =>
              prev.map((v) => (v._id === updated._id ? { ...v, ...updated } : v))
            );
          }}
        />
      )}

      {/* Upload modal */}
      <UploadVideoModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  );
};

export default CreatorStudio;
