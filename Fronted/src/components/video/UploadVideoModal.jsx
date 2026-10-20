import React, { useState } from "react";
import { Upload, Video, Image as ImageIcon } from "lucide-react";
import Modal from "../common/Modal";
import axiosInstance from "../../api/axiosInstance";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const UploadVideoModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast("Please sign in to upload videos", "error");
      return;
    }

    if (!title || !description || !videoFile || !thumbnail) {
      addToast("All fields (Title, Description, Video, Thumbnail) are required", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);
    formData.append("isPublished", isPublished);

    try {
      setUploading(true);
      setProgress(10);

      await axiosInstance.post("/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentCompleted);
        },
      });

      addToast("Video uploaded successfully!", "success");
      onClose();
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnail(null);
      setThumbnailPreview("");
      setProgress(0);
      window.location.reload();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to upload video";
      addToast(msg, "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Video" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Video File <span className="text-rose-400">*</span>
            </label>
            <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-zinc-700 hover:border-purple-500 bg-zinc-900/50 cursor-pointer p-4 transition group">
              <Video className="w-8 h-8 text-zinc-400 group-hover:text-purple-400 mb-2 transition" />
              <span className="text-xs text-zinc-300 text-center font-medium truncate max-w-full">
                {videoFile ? videoFile.name : "Select video file"}
              </span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Thumbnail Image <span className="text-rose-400">*</span>
            </label>
            <label className="relative flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-zinc-700 hover:border-purple-500 bg-zinc-900/50 cursor-pointer p-2 overflow-hidden transition group">
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-zinc-400 group-hover:text-purple-400 mb-2 transition" />
                  <span className="text-xs text-zinc-400 text-center font-medium">
                    Upload cover thumbnail
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Mastering Backend Architecture"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploading}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-zinc-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="What is this video about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={uploading}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-zinc-100 outline-none resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 bg-zinc-800 border-zinc-700"
            />
            Publish immediately (public)
          </label>
        </div>

        {uploading && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Uploading media...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/30 transition disabled:opacity-50 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Publishing..." : "Publish Video"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadVideoModal;
