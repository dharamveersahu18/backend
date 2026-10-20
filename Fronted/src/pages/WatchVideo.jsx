import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ThumbsUp,
  Share2,
  ListPlus,
  UserPlus,
  UserCheck,
  Eye,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import VideoPlayer from "../components/video/VideoPlayer";
import CommentSection from "../components/video/CommentSection";
import PlaylistModal from "../components/video/PlaylistModal";
import VideoCard from "../components/common/VideoCard";
import { WatchPageSkeleton } from "../components/common/LoadingSkeleton";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const WatchVideo = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const fetchVideoDetails = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/videos/${videoId}`);
      const v = res.data?.data;
      if (v) {
        setVideo(v);
        setIsLiked(v.isLiked || false);
        setLikesCount(v.likesCount || 0);
        setIsSubscribed(v.owner?.isSubscribed || false);
        setSubscribersCount(v.owner?.subscribersCount || 0);
      }

      // Fetch related recommendations
      const relatedRes = await axiosInstance.get("/videos", {
        params: { limit: 8 },
      });
      if (relatedRes.data?.data?.docs) {
        setRelatedVideos(
          relatedRes.data.data.docs.filter((item) => item._id !== videoId)
        );
      }
    } catch (error) {
      console.error("Failed to load video details", error);
      addToast("Failed to load video", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoId) {
      window.scrollTo(0, 0);
      fetchVideoDetails();
    }
  }, [videoId]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      addToast("Please login to like this video", "error");
      return;
    }

    try {
      const res = await axiosInstance.post(`/likes/toggle/v/${videoId}`);
      const status = res.data?.data?.isLiked;
      setIsLiked(status);
      setLikesCount((prev) => (status ? prev + 1 : Math.max(0, prev - 1)));
    } catch (error) {
      addToast("Failed to update like", "error");
    }
  };

  const handleToggleSubscribe = async () => {
    if (!isAuthenticated) {
      addToast("Please login to subscribe", "error");
      return;
    }

    if (user?._id === video?.owner?._id) {
      addToast("You cannot subscribe to your own channel", "info");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/subscriptions/c/${video?.owner?._id}`
      );
      const status = res.data?.data?.isSubscribed;
      setIsSubscribed(status);
      setSubscribersCount((prev) => (status ? prev + 1 : Math.max(0, prev - 1)));
      addToast(status ? "Subscribed!" : "Unsubscribed", "info");
    } catch (error) {
      addToast("Failed to update subscription", "error");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast("Video link copied to clipboard!", "success");
  };

  if (loading) return <WatchPageSkeleton />;
  if (!video)
    return (
      <div className="p-8 text-center text-zinc-400">
        Video not found or has been removed.
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full pb-12">
      {/* Primary Video Container */}
      <div className="flex-1 flex flex-col">
        {/* Player */}
        <VideoPlayer src={video.videoFile} poster={video.thumbnail} />

        {/* Video Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 mt-4 leading-snug">
          {video.title}
        </h1>

        {/* Channel Info & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-zinc-800/80 mt-1">
          {/* Channel Info */}
          <div className="flex items-center gap-3">
            <Link to={`/c/${video.owner?.username}`}>
              <img
                src={
                  video.owner?.avatar ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                }
                alt={video.owner?.fullName}
                className="w-11 h-11 rounded-full object-cover border border-zinc-800 shadow"
              />
            </Link>
            <div className="flex flex-col">
              <Link
                to={`/c/${video.owner?.username}`}
                className="text-sm font-semibold text-zinc-100 hover:text-purple-400 transition"
              >
                {video.owner?.fullName || video.owner?.username}
              </Link>
              <span className="text-xs text-zinc-400">
                {subscribersCount} subscribers
              </span>
            </div>

            {user?._id !== video.owner?._id && (
              <button
                onClick={handleToggleSubscribe}
                className={`ml-3 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shadow-md transition-all cursor-pointer ${
                  isSubscribed
                    ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                    : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30"
                }`}
              >
                {isSubscribed ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                    Subscribed
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    Subscribe
                  </>
                )}
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Like */}
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition cursor-pointer ${
                isLiked
                  ? "bg-purple-600/20 text-purple-400 border-purple-500/40"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{likesCount}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            {/* Save to Playlist */}
            {isAuthenticated && (
              <button
                onClick={() => setPlaylistModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition cursor-pointer"
              >
                <ListPlus className="w-4 h-4" />
                <span>Save</span>
              </button>
            )}
          </div>
        </div>

        {/* Video Description Box */}
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 mt-4 text-xs sm:text-sm text-zinc-300 shadow-inner">
          <div className="flex items-center gap-4 text-zinc-400 font-semibold mb-2">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> {video.views || 0} views
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />{" "}
              {new Date(video.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <p
            className={`whitespace-pre-line leading-relaxed ${
              !showFullDescription ? "line-clamp-3" : ""
            }`}
          >
            {video.description}
          </p>

          {video.description?.length > 150 && (
            <button
              onClick={() => setShowFullDescription((prev) => !prev)}
              className="mt-2 text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
            >
              {showFullDescription ? (
                <>
                  Show less <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  Show more <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Comments Section */}
        <CommentSection videoId={video._id} />
      </div>

      {/* Related Videos Sidebar */}
      <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-4">
        <h3 className="text-base font-semibold text-zinc-100 mb-1">
          Related Videos
        </h3>
        <div className="flex flex-col gap-4">
          {relatedVideos.map((item) => (
            <VideoCard key={item._id} video={item} />
          ))}
        </div>
      </div>

      {/* Playlist modal */}
      <PlaylistModal
        isOpen={playlistModalOpen}
        onClose={() => setPlaylistModalOpen(false)}
        videoId={video._id}
      />
    </div>
  );
};

export default WatchVideo;
