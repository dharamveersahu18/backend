import React, { useState, useEffect } from "react";
import { Tv2 } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import VideoCard from "../components/common/VideoCard";
import { Link } from "react-router-dom";

const Subscriptions = () => {
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [feedVideos, setFeedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const subRes = await axiosInstance.get("/subscriptions/u");
        const channels = subRes.data?.data || [];
        setSubscribedChannels(channels);

        // Fetch feed videos
        const vidRes = await axiosInstance.get("/videos", {
          params: { limit: 20 },
        });
        setFeedVideos(vidRes.data?.data?.docs || []);
      } catch (error) {
        console.error("Failed to load subscriptions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Subscriptions</h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Latest content from channels you follow
        </p>
      </div>

      {/* Subscribed Channels Avatars Bar */}
      {subscribedChannels.length > 0 && (
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
          {subscribedChannels.map((sub) => (
            <Link
              key={sub._id}
              to={`/c/${sub.channel?.username}`}
              className="flex flex-col items-center gap-1.5 shrink-0 group"
            >
              <img
                src={
                  sub.channel?.avatar ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                }
                alt={sub.channel?.fullName}
                className="w-14 h-14 rounded-full object-cover border-2 border-zinc-800 group-hover:border-purple-500 transition"
              />
              <span className="text-xs text-zinc-300 group-hover:text-purple-400 font-medium truncate max-w-[70px]">
                {sub.channel?.fullName}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Subscribed Videos Grid */}
      {loading ? (
        <div className="text-center text-zinc-500 py-12">Loading subscriptions...</div>
      ) : feedVideos.length === 0 ? (
        <div className="text-center text-zinc-500 py-16">
          No subscribed videos found yet. Follow more channels to build your custom feed!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {feedVideos.map((vid) => (
            <VideoCard key={vid._id} video={vid} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
