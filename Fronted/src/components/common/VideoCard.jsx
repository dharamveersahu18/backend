import React from "react";
import { Link } from "react-router-dom";

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const formatViews = (views) => {
  if (!views) return "0 views";
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
  return `${views} views`;
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const mins = Math.floor(diffInSeconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
};

const VideoCard = ({ video }) => {
  if (!video) return null;

  return (
    <div className="group flex flex-col gap-3">
      {/* Thumbnail */}
      <Link
        to={`/watch/${video._id}`}
        className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 shadow-md group-hover:shadow-purple-500/10 group-hover:border-purple-500/30 transition-all duration-300"
      >
        <img
          src={video.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {video.duration > 0 && (
          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-white text-xs font-semibold backdrop-blur-sm">
            {formatDuration(video.duration)}
          </span>
        )}
      </Link>

      {/* Meta Info */}
      <div className="flex gap-3 items-start px-0.5">
        <Link
          to={`/c/${video.owner?.username}`}
          className="shrink-0 rounded-full hover:opacity-80 transition"
        >
          <img
            src={video.owner?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
            alt={video.owner?.fullName || "Channel"}
            className="w-9 h-9 rounded-full object-cover border border-zinc-800"
          />
        </Link>
        <div className="flex flex-col w-full min-w-0">
          <Link
            to={`/watch/${video._id}`}
            className="font-medium text-zinc-100 text-sm group-hover:text-purple-400 line-clamp-2 leading-snug transition-colors"
            title={video.title}
          >
            {video.title}
          </Link>
          <Link
            to={`/c/${video.owner?.username}`}
            className="text-xs text-zinc-400 hover:text-zinc-200 mt-1 truncate transition-colors"
          >
            {video.owner?.fullName || video.owner?.username || "Chai aur Code"}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
            <span>{formatViews(video.views)}</span>
            <span>•</span>
            <span>{formatTimeAgo(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
