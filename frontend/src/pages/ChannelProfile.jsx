import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Video, ListVideo, MessageSquareQuote, Info, Film } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import ChannelHeader from "../components/channel/ChannelHeader";
import VideoCard from "../components/common/VideoCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const ChannelProfile = () => {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [activeTab, setActiveTab] = useState("videos");
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const fetchChannelData = async () => {
    try {
      setLoading(true);
      const profileRes = await axiosInstance.get(`/users/c/${username}`);
      const profile = profileRes.data?.data;
      setChannel(profile);

      if (profile?._id) {
        // Fetch videos
        const vidsRes = await axiosInstance.get("/videos", {
          params: { userId: profile._id },
        });
        setVideos(vidsRes.data?.data?.docs || []);

        // Fetch playlists
        const plRes = await axiosInstance.get(`/playlists/user/${profile._id}`);
        setPlaylists(plRes.data?.data || []);

        // Fetch tweets
        const twRes = await axiosInstance.get(`/tweets/user/${profile._id}`);
        setTweets(twRes.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to load channel", error);
      addToast("Failed to load channel details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchChannelData();
    }
  }, [username]);

  const handleToggleSubscribe = async () => {
    if (!isAuthenticated) {
      addToast("Please login to subscribe", "error");
      return;
    }

    try {
      const res = await axiosInstance.post(`/subscriptions/c/${channel._id}`);
      const isSub = res.data?.data?.isSubscribed;
      setChannel((prev) => ({
        ...prev,
        isSubscribed: isSub,
        subscribersCount: isSub
          ? (prev.subscribersCount || 0) + 1
          : Math.max(0, (prev.subscribersCount || 0) - 1),
      }));
      addToast(isSub ? "Subscribed!" : "Unsubscribed", "info");
    } catch (error) {
      addToast("Failed to update subscription", "error");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading channel...</div>;
  }

  if (!channel) {
    return (
      <div className="p-8 text-center text-zinc-400">Channel not found.</div>
    );
  }

  return (
    <div className="flex flex-col max-w-7xl mx-auto w-full pb-12">
      <ChannelHeader
        channel={channel}
        onToggleSubscribe={handleToggleSubscribe}
        isSubscribed={channel.isSubscribed}
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-6 border-b border-zinc-800 px-4 mb-6">
        <button
          onClick={() => setActiveTab("videos")}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === "videos"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Video className="w-4 h-4" />
          Videos ({videos.length})
        </button>

        <button
          onClick={() => setActiveTab("playlists")}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === "playlists"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <ListVideo className="w-4 h-4" />
          Playlists ({playlists.length})
        </button>

        <button
          onClick={() => setActiveTab("community")}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === "community"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <MessageSquareQuote className="w-4 h-4" />
          Community ({tweets.length})
        </button>

        <button
          onClick={() => setActiveTab("about")}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === "about"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Info className="w-4 h-4" />
          About
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "videos" && (
        <div>
          {videos.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              This channel has not uploaded any videos yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {videos.map((vid) => (
                <VideoCard key={vid._id} video={{ ...vid, owner: channel }} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "playlists" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.length === 0 ? (
            <div className="col-span-full py-12 text-center text-zinc-500">
              No public playlists created yet.
            </div>
          ) : (
            playlists.map((pl) => (
              <div
                key={pl._id}
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-2"
              >
                <h4 className="font-semibold text-zinc-100 text-base">{pl.name}</h4>
                <p className="text-xs text-zinc-400">
                  {pl.description || "No description provided"}
                </p>
                <span className="text-xs text-purple-400 font-medium mt-2">
                  {pl.videos?.length || 0} videos
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "community" && (
        <div className="flex flex-col gap-4 max-w-2xl">
          {tweets.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              No community posts yet.
            </div>
          ) : (
            tweets.map((tw) => (
              <div
                key={tw._id}
                className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={channel.avatar}
                    alt={channel.fullName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <span className="text-xs font-semibold text-zinc-200">
                      {channel.fullName}
                    </span>
                    <span className="text-xs text-zinc-500 ml-2">
                      {new Date(tw.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-zinc-200 mt-1 whitespace-pre-line">
                  {tw.content}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "about" && (
        <div className="max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-base font-semibold text-zinc-100">About {channel.fullName}</h3>
          <div className="flex flex-col gap-2 text-sm text-zinc-400">
            <p>Username: @{channel.username}</p>
            <p>Email: {channel.email}</p>
            <p>
              Joined:{" "}
              {new Date(channel.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p>Total Subscribers: {channel.subscribersCount || 0}</p>
            <p>Total Videos Uploaded: {channel.totalVideos || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelProfile;
