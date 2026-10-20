import React, { useState, useEffect } from "react";
import { History as HistoryIcon, Trash2 } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import VideoCard from "../components/common/VideoCard";
import { useToast } from "../context/ToastContext";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/users/history");
      setHistory(res.data?.data || []);
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your entire watch history?"))
      return;

    try {
      await axiosInstance.delete("/users/history");
      setHistory([]);
      addToast("Watch history cleared", "info");
    } catch (error) {
      addToast("Failed to clear history", "error");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <HistoryIcon className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Watch History</h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Videos you have watched recently
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-rose-500/10 text-zinc-300 hover:text-rose-400 border border-zinc-800 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Clear All History
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-zinc-500 py-12">Loading watch history...</div>
      ) : history.length === 0 ? (
        <div className="text-center text-zinc-500 py-16">
          Your watch history is clean and empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {history.map((vid) => (
            <VideoCard key={vid._id} video={vid} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
