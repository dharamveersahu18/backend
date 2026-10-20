import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Sparkles, SlidersHorizontal, VideoOff } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import VideoCard from "../components/common/VideoCard";
import CategoryBar from "../components/common/CategoryBar";
import { VideoGridSkeleton } from "../components/common/LoadingSkeleton";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const query = selectedCategory === "All" ? searchQuery : selectedCategory;
      const res = await axiosInstance.get("/videos", {
        params: {
          query,
          sortBy,
          sortType,
          limit: 24,
        },
      });
      if (res.data?.data?.docs) {
        setVideos(res.data.data.docs);
      }
    } catch (error) {
      console.error("Failed to fetch videos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [searchQuery, selectedCategory, sortBy, sortType]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      {/* Category Bar and Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
          <select
            value={`${sortBy}_${sortType}`}
            onChange={(e) => {
              const [sb, st] = e.target.value.split("_");
              setSortBy(sb);
              setSortType(st);
            }}
            className="bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 rounded-xl px-3 py-1.5 outline-none cursor-pointer focus:border-purple-500"
          >
            <option value="createdAt_desc">Latest Uploads</option>
            <option value="views_desc">Most Popular</option>
            <option value="createdAt_asc">Oldest</option>
          </select>
        </div>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <VideoGridSkeleton count={8} />
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4 shadow-inner">
            <VideoOff className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-1">
            No videos found
          </h3>
          <p className="text-sm text-zinc-400 max-w-md">
            {searchQuery || selectedCategory !== "All"
              ? "Try searching for another topic or clear the filter."
              : "Be the first to upload an amazing video on VideoTube!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
