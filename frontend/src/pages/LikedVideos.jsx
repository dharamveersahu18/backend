import React, { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import VideoCard from "../components/common/VideoCard";

const LikedVideos = () => {
  const [likedList, setLikedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/likes/videos");
        setLikedList(res.data?.data || []);
      } catch (error) {
        console.error("Failed to load liked videos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLiked();
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
          <ThumbsUp className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Liked Videos</h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            {likedList.length} {likedList.length === 1 ? "video" : "videos"} you have liked
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-zinc-500 py-12">Loading liked videos...</div>
      ) : likedList.length === 0 ? (
        <div className="text-center text-zinc-500 py-16">
          You haven't liked any videos yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {likedList.map((item) => (
            <VideoCard key={item._id} video={item.video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedVideos;
