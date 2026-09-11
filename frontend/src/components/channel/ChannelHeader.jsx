import React from "react";
import { UserCheck, UserPlus, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ChannelHeader = ({ channel, onToggleSubscribe, isSubscribed }) => {
  const { user } = useAuth();
  const isOwner = user?._id === (channel?._id || channel?.id);

  if (!channel) return null;

  return (
    <div className="flex flex-col w-full mb-6">
      {/* Banner */}
      <div className="relative w-full h-36 sm:h-52 md:h-64 rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-900 via-purple-950/40 to-zinc-900 border border-zinc-800">
        {channel.coverImage && (
          <img
            src={channel.coverImage}
            alt="Channel Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 sm:px-6 -mt-12 sm:-mt-14 relative z-10">
        <div className="flex items-end sm:items-center gap-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-[#0f0f0f] bg-zinc-800 shadow-2xl shrink-0">
            <img
              src={
                channel.avatar ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
              }
              alt={channel.fullName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col mb-1 sm:mb-0">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 leading-tight">
              {channel.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">@{channel.username}</p>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
              <span>{channel.subscribersCount || 0} subscribers</span>
              <span>•</span>
              <span>{channel.totalVideos || 0} videos</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="self-end sm:self-center">
          {isOwner ? (
            <Link
              to="/settings"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold border border-zinc-700 transition"
            >
              <Settings className="w-4 h-4" />
              Customize Channel
            </Link>
          ) : (
            <button
              onClick={onToggleSubscribe}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold shadow-lg transition-all duration-200 cursor-pointer ${
                isSubscribed
                  ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30"
              }`}
            >
              {isSubscribed ? (
                <>
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  Subscribed
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Subscribe
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelHeader;
