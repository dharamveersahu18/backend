import React, { useState, useEffect } from "react";
import { MessageSquareQuote, Send, ThumbsUp, Trash2 } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Community = () => {
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const fetchTweets = async () => {
    try {
      setLoading(true);
      // Fetch channel tweets or current user tweets
      if (user?._id) {
        const res = await axiosInstance.get(`/tweets/user/${user._id}`);
        setTweets(res.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to load tweets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [user]);

  const handleCreateTweet = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!isAuthenticated) {
      addToast("Please login to post community updates", "error");
      return;
    }

    try {
      setPosting(true);
      const res = await axiosInstance.post("/tweets", { content: content.trim() });
      setTweets((prev) => [res.data.data, ...prev]);
      setContent("");
      addToast("Community post shared!", "success");
    } catch (error) {
      addToast("Failed to post tweet", "error");
    } finally {
      setPosting(false);
    }
  };

  const handleToggleLike = async (tweetId) => {
    if (!isAuthenticated) {
      addToast("Please login to like posts", "error");
      return;
    }

    try {
      const res = await axiosInstance.post(`/likes/toggle/t/${tweetId}`);
      const { isLiked } = res.data?.data || {};
      setTweets((prev) =>
        prev.map((t) => {
          if (t._id === tweetId) {
            return {
              ...t,
              isLiked,
              likesCount: isLiked ? (t.likesCount || 0) + 1 : Math.max(0, (t.likesCount || 0) - 1),
            };
          }
          return t;
        })
      );
    } catch (error) {
      addToast("Failed to update like", "error");
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axiosInstance.delete(`/tweets/${tweetId}`);
      setTweets((prev) => prev.filter((t) => t._id !== tweetId));
      addToast("Post deleted", "info");
    } catch (error) {
      addToast("Failed to delete post", "error");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full pb-12">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Community Posts</h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Share updates, tips, and thoughts with your community
        </p>
      </div>

      {/* Post creator */}
      {isAuthenticated && (
        <form
          onSubmit={handleCreateTweet}
          className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-3 shadow-md"
        >
          <div className="flex gap-3">
            <img
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
              }
              alt="User"
              className="w-10 h-10 rounded-full object-cover shrink-0 border border-zinc-800"
            />
            <textarea
              rows={3}
              placeholder="What's on your mind? Share an update..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none resize-none"
            />
          </div>
          <div className="flex justify-end pt-2 border-t border-zinc-800">
            <button
              type="submit"
              disabled={posting || !content.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {posting ? "Posting..." : "Post Update"}
            </button>
          </div>
        </form>
      )}

      {/* Tweet feed */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-center text-zinc-500 py-8">Loading posts...</div>
        ) : tweets.length === 0 ? (
          <div className="text-center text-zinc-500 py-12">
            No community posts yet. Create the first one!
          </div>
        ) : (
          tweets.map((tw) => (
            <div
              key={tw._id}
              className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-3 shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      tw.owner?.avatar ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                    }
                    alt="Author"
                    className="w-9 h-9 rounded-full object-cover border border-zinc-800"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-200">
                      {tw.owner?.fullName || "Chai aur Code"}
                    </h4>
                    <span className="text-xs text-zinc-500">
                      {new Date(tw.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {user?._id === (tw.owner?._id || tw.owner) && (
                  <button
                    onClick={() => handleDeleteTweet(tw._id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-sm text-zinc-200 whitespace-pre-line leading-relaxed">
                {tw.content}
              </p>

              <div className="flex items-center gap-3 pt-2 border-t border-zinc-800/60">
                <button
                  onClick={() => handleToggleLike(tw._id)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition cursor-pointer ${
                    tw.isLiked
                      ? "text-purple-400"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{tw.likesCount || 0}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community;
